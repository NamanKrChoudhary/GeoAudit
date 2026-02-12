import Area from "../models/Area.model.js";

export const getAllAreas = async (req, res) => {
  try {
    const areas = await Area.find().select("-plots.polygons"); // light payload
    res.json(areas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAreaById = async (req, res) => {
  try {
    const area = await Area.findOne({ areaId: req.params.areaId });
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
