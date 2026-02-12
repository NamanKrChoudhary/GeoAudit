import mongoose from "mongoose";

const AreaSchema = new mongoose.Schema({
  areaId: {
    type: String,
    required: true,
    unique: true
  },
  areaName: String,
  plots: []
});

export default mongoose.model("Area", AreaSchema);
