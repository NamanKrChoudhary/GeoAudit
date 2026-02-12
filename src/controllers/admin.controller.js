import Area from "../models/Area.model.js";
import { callMLApi } from "../services/mlApi.service.js";
import { uploadToCloud } from "../services/storage.service.js"; // <--- Added this import

// --- 1. SCAN AREA (Updated with Cloudinary) ---
export const scanArea = async (req, res) => {
  try {
    const satelliteFile = req.files?.satelliteImage?.[0];
    const plannedFile = req.files?.plannedImage?.[0];

    if (!satelliteFile || !plannedFile) {
      return res
        .status(400)
        .json({ message: "Both satellite and planned images are required" });
    }

    // 1. Call ML API (Using local files)
    const mlResult = await callMLApi(satelliteFile.path, plannedFile.path);

    if (!mlResult || !mlResult.areaId) {
      return res
        .status(500)
        .json({ message: "ML API did not return valid data" });
    }

    // 2. Upload images to Cloudinary (Storage)
    // We run these in parallel to save time
    const [satUpload, planUpload] = await Promise.all([
      uploadToCloud(satelliteFile.path, "geo-audit/satellite"),
      uploadToCloud(plannedFile.path, "geo-audit/planned"),
    ]);

    // 3. Save to DB
    const area = await Area.findOneAndUpdate(
      { areaId: mlResult.areaId },
      {
        areaId: mlResult.areaId,
        areaName: mlResult.areaName || "Unnamed Area",

        // Save the Cloudinary URL, not the local path
        satelliteImage: {
          imageId: satUpload.publicId, // Save ID for deletion later
          source: "satellite",
          capturedAt: new Date(),
          resolution: "unknown",
          imageUrl: satUpload.url, // <--- The Cloud URL
        },

        plots: mlResult.plots || [],
        summary: mlResult.summary,
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      message: "Scan completed successfully",
      area,
    });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ message: "Scan failed", error: err.message });
  }
};

// --- 2. DELETE AREA (Kept from original) ---
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

// --- 3. TOGGLE FLAGS (Kept from original) ---
export const toggleEncroachmentFlag = async (req, res) => {
  try {
    const { areaId, plotId } = req.params;
    const { requiresManualReview, status } = req.body;

    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const plot = area.plots.find((p) => p.plotId === plotId);
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
      plot,
    });
  } catch (err) {
    console.error("Toggle flags error:", err);
    res.status(500).json({ message: err.message });
  }
};
