import Area from "../models/Area.model.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import {
  getAllPlots,
  getEncroachedPlots,
  getUsageStats,
} from "../services/ml.service.js";
import fs from "fs";

// --- DASHBOARD DATA (GET) ---
export const getAreaIntelligence = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findOne({ areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    const metrics = {
      complianceHealth:
        area.summary.totalPlots > 0
          ? (
              (area.summary.compliantPlots / area.summary.totalPlots) *
              100
            ).toFixed(1)
          : 0,
      totalEncroachedArea: area.plots.reduce(
        (acc, p) => acc + (p.polygons.encroached?.areaSqM || 0),
        0,
      ),
      totalUnusedArea: area.plots.reduce(
        (acc, p) => acc + (p.polygons.unused?.areaSqM || 0),
        0,
      ),
    };

    const plotData = area.plots.map((p) => ({
      plotId: p.plotId,
      owner: p.ownerName,
      status: p.compliance.status,
      isEncroached: p.isEncroached,
      usage: p.usageStats,
      geometry: {
        intended: p.polygons.intended.polygon,
        existing: p.polygons.existing.polygon,
        encroached: p.polygons.encroached.polygon,
        unused: p.polygons.unused.polygon,
      },
      // Fallback to satellite image if specific background is missing
      backgroundUrl: area.satelliteImage ? area.satelliteImage.imageUrl : "",
    }));

    res.json({ areaName: area.areaName, metrics, plots: plotData });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- ML PIPELINE (POST) ---
export const processLandPlan = async (req, res) => {
  try {
    // 1. Validation
    if (!req.files || !req.files.plotImage || !req.files.satelliteImage) {
      return res.status(400).json({
        message: "Both 'plotImage' and 'satelliteImage' files are required.",
      });
    }

    const plotImgPath = req.files.plotImage[0].path;
    const satImgPath = req.files.satelliteImage[0].path;
    const { areaId, areaName } = req.body;

    console.log("🚀 Starting 3-Stage Intelligence Pipeline...");

    // 2. Parallel ML Execution
    const [allPlots, encroachedPlots, usageData] = await Promise.all([
      getAllPlots(plotImgPath), // API 1
      getEncroachedPlots(plotImgPath), // API 2
      getUsageStats(satImgPath, plotImgPath), // API 3
    ]);

    // 3. Upload to Cloudinary (Background)
    const satCloud = await uploadToCloudinary(satImgPath, "satellite-maps");
    const plotCloud = await uploadToCloudinary(plotImgPath, "plot-maps");

    // 4. Merge Data Logic
    // Extract the array from the 'report' key in API 3 response
    const usageReport = usageData.report || []; // <--- CHANGED: Extract array from object

    const mergedPlots = allPlots.map((plot, index) => {
      // API 1 usually returns 'id'. If missing, generate one.
      const currentId = plot.id || `${areaId}_P${index + 1}`;

      // --- FIX 1: MATCHING LOGIC ---
      // API 2 (Encroached) might use 'id' or 'plot_id'. Check both.
      const isEncroached = encroachedPlots.some(
        (e) => e.id === currentId || e.plot_id === currentId,
      );

      // --- FIX 2: USAGE STATS MAPPING ---
      // API 3 uses 'plot_id' and 'unused_area_percentage'
      // Use usageReport instead of usageData
      const rawStats = usageReport.find((u) => u.plot_id === currentId) || {}; // <--- CHANGED

      // Calculate percentages based on your API response
      // Default to 0 if data is missing
      const unusedPct = rawStats.unused_area_percentage || 0;
      const constructedPct = rawStats.unused_area_percentage
        ? (100 - unusedPct).toFixed(2)
        : 0;

      return {
        plotId: currentId,
        ownerName: "Unassigned",
        ownerEmail: "",
        isEncroached: isEncroached,
        compliance: {
          status: isEncroached ? "ENCROACHED" : "COMPLIANT",
        },
        usageStats: {
          constructedPercent: Number(constructedPct), // We calculated this
          greeneryPercent: Number(unusedPct), // Mapped directly from JSON
        },
        polygons: {
          // Ensure we use the correct key for coordinates from API 1 (likely 'coords' or 'points')
          intended: {
            polygon: plot.coords || plot.points || [],
            areaSqM: plot.area_pixel || 0,
          },
          existing: { polygon: [] },
          encroached: { polygon: [] },
          unused: { polygon: [] },
        },
      };
    });

    // 5. Save to Database
    let area = await Area.findOne({ areaId });
    if (!area) {
      area = new Area({ areaId, areaName, plots: [] });
    }

    area.satelliteImage = {
      imageUrl: satCloud.secure_url,
      imageId: satCloud.public_id,
    };
    area.plotMapImage = {
      imageUrl: plotCloud.secure_url,
      imageId: plotCloud.public_id,
    };
    area.plots = mergedPlots;

    // Update Summary
    const total = mergedPlots.length;
    const encroachedCount = mergedPlots.filter((p) => p.isEncroached).length;
    area.summary = {
      totalPlots: total,
      compliantPlots: total - encroachedCount,
      encroachedPlots: encroachedCount,
      unusedPlots: 0,
      overallComplianceScore:
        total > 0 ? ((total - encroachedCount) / total) * 100 : 0,
    };

    await area.save();

    // 6. Cleanup Local Files
    if (fs.existsSync(plotImgPath)) fs.unlinkSync(plotImgPath);
    if (fs.existsSync(satImgPath)) fs.unlinkSync(satImgPath);

    res.status(200).json({
      message: "Intelligence pipeline completed.",
      stats: { total, encroached: encroachedCount },
      data: area,
    });
  } catch (error) {
    console.error("Pipeline Error:", error);
    // Cleanup on error
    if (req.files?.plotImage && fs.existsSync(req.files.plotImage[0].path))
      fs.unlinkSync(req.files.plotImage[0].path);
    if (
      req.files?.satelliteImage &&
      fs.existsSync(req.files.satelliteImage[0].path)
    )
      fs.unlinkSync(req.files.satelliteImage[0].path);

    res.status(500).json({ message: "Pipeline failed", error: error.message });
  }
};
