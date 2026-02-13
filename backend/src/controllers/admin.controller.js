import Area from "../models/Area.model.js";
import { getAllPlots } from "../services/ml.service.js"; // Uses the real ML service
import { uploadToCloud, deleteFromCloud } from "../services/storage.service.js";

// --- 1. SCAN AREA (Integrated with Real ML API) ---
export const scanArea = async (req, res) => {
  try {
    const satelliteFile = req.files?.satelliteImage?.[0];
    const plannedFile = req.files?.plannedImage?.[0];

    // Ensure files exist before proceeding
    if (!satelliteFile || !plannedFile) {
      return res
        .status(400)
        .json({ message: "Both satellite and planned images are required" });
    }

    // 1. Call the REAL ML API (API 1: Plot Extraction)
    const mlResult = await getAllPlots(plannedFile.path);

    // Validation: Ensure ML returned an array of plots
    if (!mlResult || !Array.isArray(mlResult)) {
      return res
        .status(500)
        .json({ message: "ML API failed to return valid plot data" });
    }

    // 2. Upload images to Cloudinary (Storage) in parallel
    const [satUpload, planUpload] = await Promise.all([
      uploadToCloud(satelliteFile.path, "geo-audit/satellite"),
      uploadToCloud(plannedFile.path, "geo-audit/planned"),
    ]);

    // 3. Save to DB using Upsert logic
    // Use areaId from body or generate a timestamped one
    const areaId = req.body.areaId || `AREA_${Date.now()}`;

    const area = await Area.findOneAndUpdate(
      { areaId: areaId },
      {
        areaId: areaId,
        areaName: req.body.areaName || "New Scanned Area",
        satelliteImage: {
          imageId: satUpload.publicId,
          imageUrl: satUpload.url,
        },
        plotMapImage: {
          imageId: planUpload.publicId,
          imageUrl: planUpload.url,
        },
        // Map the real ML coordinates to the schema
        plots: mlResult.map((p, index) => ({
          plotId: p.id || `P_${index}`,
          polygons: {
            intended: {
              polygon: p.coords || [],
              areaSqM: p.area_pixel || 0,
            },
          },
          compliance: { status: "COMPLIANT" },
        })),
        updatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      message: "Scan and initialization completed successfully",
      area,
    });
  } catch (err) {
    console.error("Scan error:", err);
    res.status(500).json({ message: "Scan failed", error: err.message });
  }
};

// --- 2. DELETE AREA (Original Logic Maintained) ---
export const deleteArea = async (req, res) => {
  try {
    const { areaId } = req.params;

    // Fetch area first to get image IDs for Cloudinary cleanup
    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    // Optional: Delete images from Cloudinary to save space
    if (area.satelliteImage?.imageId)
      await deleteFromCloud(area.satelliteImage.imageId);
    if (area.plotMapImage?.imageId)
      await deleteFromCloud(area.plotMapImage.imageId);

    await Area.deleteOne({ areaId });
    res.json({ message: "Area and associated images deleted successfully" });
  } catch (err) {
    console.error("Delete area error:", err);
    res.status(500).json({ message: err.message });
  }
};

// --- 3. TOGGLE FLAGS (Original Logic Maintained) ---
export const toggleEncroachmentFlag = async (req, res) => {
  try {
    const { areaId, plotId } = req.params;
    const { requiresManualReview, status } = req.body;

    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const plot = area.plots.find((p) => p.plotId === plotId);
    if (!plot) return res.status(404).json({ message: "Plot not found" });

    // Update status and flags manually
    if (typeof requiresManualReview === "boolean") {
      plot.compliance.requiresManualReview = requiresManualReview;
    }

    if (status) {
      plot.compliance.status = status;
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
