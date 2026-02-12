import Area from "../models/Area.model.js";

// GET /api/public/areas?page=1&limit=10&encroached=true&manualReview=true&owner=alpha
export const getAllAreas = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const encroached = req.query.encroached === "true";
    const manualReview = req.query.manualReview === "true";
    const owner = req.query.owner?.trim();

    const filter = {};

    if (encroached) {
      filter["plots.compliance.status"] = "ENCROACHED";
    }

    if (manualReview) {
      filter["plots.compliance.requiresManualReview"] = true;
    }

    if (owner) {
      filter["plots.ownerName"] = { $regex: owner, $options: "i" };
    }

    const [areasRaw, total] = await Promise.all([
      Area.find(filter)
        .select("areaId areaName summary satelliteImage updatedAt plots")
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 })
        .lean(),
      Area.countDocuments(filter)
    ]);

    const areas = areasRaw.map(area => {
      const hasEncroachment = area.plots?.some(p => p.compliance?.status === "ENCROACHED");
      const requiresManualReview = area.plots?.some(p => p.compliance?.requiresManualReview);

      // If owner search is active, return only matching plots with polygons
      let ownerPlots = undefined;

      if (owner) {
        ownerPlots = area.plots
          .filter(p => new RegExp(owner, "i").test(p.ownerName))
          .map(p => ({
            plotId: p.plotId,
            plotNumber: p.plotNumber,
            ownerName: p.ownerName,
            status: p.compliance.status,
            deviationPercent: p.compliance.deviationPercent,
            requiresManualReview: p.compliance.requiresManualReview,
            polygons: p.polygons // 🔥 return all 4 polygons only here
          }));
      }

      return {
        areaId: area.areaId,
        areaName: area.areaName,
        summary: area.summary,
        flags: {
          hasEncroachment: Boolean(hasEncroachment),
          requiresManualReview: Boolean(requiresManualReview)
        },
        lastUpdated: area.updatedAt,
        previewImage: area.satelliteImage?.imageUrl || null,

        ...(owner && { ownerPlots }) // only include when searching by owner
      };
    });

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      areas
    });
  } catch (err) {
    console.error("getAllAreas error:", err);
    res.status(500).json({ message: "Failed to fetch areas" });
  }
};

// GET /api/public/areas/:areaId
export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findOne({ areaId: req.params.areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });

    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/public/stats
export const getDashboardStats = async (req, res) => {
  try {
    const areas = await Area.find({});

    let totalPlots = 0;
    let encroachedPlots = 0;
    let unusedPlots = 0;
    let areasWithEncroachment = 0;
    let areasWithManualReview = 0;

    areas.forEach(area => {
      let hasEncroach = false;
      let hasManual = false;

      area.plots.forEach(plot => {
        totalPlots++;

        if (plot.compliance.status === "ENCROACHED") {
          encroachedPlots++;
          hasEncroach = true;
        }

        if (plot.compliance.status === "UNUSED") {
          unusedPlots++;
        }

        if (plot.compliance.requiresManualReview) {
          hasManual = true;
        }
      });

      if (hasEncroach) areasWithEncroachment++;
      if (hasManual) areasWithManualReview++;
    });

    res.json({
      totalAreas: areas.length,
      areasWithEncroachment,
      areasWithManualReview,
      totalPlots,
      encroachedPlots,
      unusedPlots
    });
  } catch (err) {
    console.error("getDashboardStats error:", err);
    res.status(500).json({ message: err.message });
  }
};


// GET /api/public/areas/:areaId/plots/:plotId
export const getPlotById = async (req, res) => {
  try {
    const { areaId, plotId } = req.params;

    const area = await Area.findOne({ areaId }).select("areaId areaName plots");
    if (!area) return res.status(404).json({ message: "Area not found" });

    const plot = area.plots.find(p => p.plotId === plotId);
    if (!plot) return res.status(404).json({ message: "Plot not found" });

    res.json({
      areaId: area.areaId,
      areaName: area.areaName,
      plot: {
        plotId: plot.plotId,
        plotNumber: plot.plotNumber,
        ownerName: plot.ownerName,
        status: plot.compliance.status,
        deviationPercent: plot.compliance.deviationPercent,
        requiresManualReview: plot.compliance.requiresManualReview,

        polygons: {
          planned: plot.polygons.planned,
          occupied: plot.polygons.occupied,
          unused: plot.polygons.unused,
          encroachment: plot.polygons.encroachment
        }
      }
    });
  } catch (err) {
    console.error("getPlotById error:", err);
    res.status(500).json({ message: err.message });
  }
};
