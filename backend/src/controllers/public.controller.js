import Area from "../models/Area.model.js";

// GET /api/public/areas?page=1&limit=10&encroached=true
export const getAllAreas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const encroached = req.query.encroached;
    const manualReview = req.query.manualReview;

    let filter = {};

    if (encroached === "true") {
      filter["plots.compliance.status"] = "ENCROACHED";
    }

    if (manualReview === "true") {
      filter["plots.compliance.requiresManualReview"] = true;
    }

    const [areas, total] = await Promise.all([
      Area.find(filter)
        .select("areaId areaName summary satelliteImage updatedAt")
        .skip(skip)
        .limit(limit)
        .sort({ updatedAt: -1 }),
      Area.countDocuments(filter)
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      areas
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
    const totalAreas = await Area.countDocuments();

    const encroachedAreas = await Area.countDocuments({
      "plots.compliance.status": "ENCROACHED"
    });

    const manualReviewRequired = await Area.countDocuments({
      "plots.compliance.requiresManualReview": true
    });

    res.json({
      totalAreas,
      encroachedAreas,
      manualReviewRequired
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
