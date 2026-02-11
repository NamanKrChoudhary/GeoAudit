import Area from "../models/Area.model.js";
import { callMLApi } from "../services/mlApi.service.js";

export const scanArea = async (req, res) => {
  try {
    const satelliteImage = req.files?.satelliteImage?.[0];
    const plannedImage = req.files?.plannedImage?.[0];

    if (!satelliteImage || !plannedImage) {
      return res.status(400).json({ message: "Both satellite and planned images are required" });
    }

    // Call ML API (currently returns dummy data)
    const mlResult = await callMLApi(satelliteImage.path, plannedImage.path);

    if (!mlResult || !mlResult.areaId) {
      return res.status(500).json({ message: "ML API did not return valid data" });
    }

    // Upsert Area with ML results
    const area = await Area.findOneAndUpdate(
      { areaId: mlResult.areaId },
      {
        areaId: mlResult.areaId,
        areaName: mlResult.areaName || "Unnamed Area",
        satelliteImage: {
          imageId: Date.now().toString(),
          source: "satellite/drone",
          capturedAt: new Date(),
          resolution: "unknown",
          imageUrl: satelliteImage.filename
        },
        plots: mlResult.plots || [],
        summary: mlResult.summary || {
          totalPlots: mlResult.plots?.length || 0,
          compliantPlots: 0,
          encroachedPlots: 0,
          partiallyUsedPlots: 0,
          unusedPlots: 0,
          lastProcessedAt: new Date()
        },
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      message: "Scan completed successfully (dummy ML data used)",
      area
    });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ message: "Scan failed", error: err.message });
  }
};

export const deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    const result = await Area.deleteOne({ areaId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Area not found" });
    }

    res.json({ message: "Area deleted successfully" });
  } catch (err) {
    console.error("Delete area error:", err);
    res.status(500).json({ message: err.message });
  }
};

export const toggleEncroachmentFlag = async (req, res) => {
  try {
    const { areaId, plotId } = req.params;
    const { requiresManualReview, status } = req.body;

    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const plot = area.plots.find(p => p.plotId === plotId);
    if (!plot) return res.status(404).json({ message: "Plot not found" });

    if (typeof requiresManualReview === "boolean") {
      plot.compliance.requiresManualReview = requiresManualReview;
    }

    if (status) {
      plot.compliance.status = status; // COMPLIANT | PARTIAL | ENCROACHED | UNUSED
    }

    plot.updatedAt = new Date();
    area.updatedAt = new Date();

    await area.save();

    res.json({
      message: "Plot flags updated successfully",
      plot
    });
  } catch (err) {
    console.error("Toggle flags error:", err);
    res.status(500).json({ message: err.message });
  }
};
