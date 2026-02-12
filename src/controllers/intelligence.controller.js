import Area from "../models/Area.model.js";

/**
 * GET /api/intelligence/summary/:areaId
 * Provides metrics and geometry data for the "Bamboozle" UI
 */
export const getAreaIntelligence = async (req, res) => {
  try {
    const { areaId } = req.params;
    const area = await Area.findOne({ areaId });

    if (!area) return res.status(404).json({ message: "Area not found" });

    // 1. Prepare Metrics
    const metrics = {
      complianceHealth: (
        (area.summary.compliantPlots / area.summary.totalPlots) *
        100
      ).toFixed(2),
      totalEncroachedArea: area.plots.reduce(
        (acc, p) => acc + (p.polygons.encroached?.areaSqM || 0),
        0,
      ),
      totalUnusedArea: area.plots.reduce(
        (acc, p) => acc + (p.polygons.unused?.areaSqM || 0),
        0,
      ),
      revenueAtRisk: area.plots.reduce(
        (acc, p) => acc + (p.compliance.deviationPercent > 10 ? 5000 : 0),
        0,
      ), // Dummy fine calc
    };

    // 2. Prepare plot data with Cloudinary and Polygons
    const plotData = area.plots.map((plot) => ({
      plotId: plot.plotId,
      owner: plot.ownerName,
      status: plot.compliance.status,
      deviation: plot.compliance.deviationPercent,
      // Cloudinary image to overlay on
      backgroundSatelliteUrl: area.satelliteImage.imageUrl,
      // Polygons for frontend shading
      geometry: {
        intended: plot.polygons.intended.polygon,
        existing: plot.polygons.existing.polygon,
        encroached: plot.polygons.encroached.polygon,
        unused: plot.polygons.unused.polygon,
      },
    }));

    res.json({
      areaName: area.areaName,
      metrics,
      plots: plotData,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Intelligence fetch failed", error: err.message });
  }
};
