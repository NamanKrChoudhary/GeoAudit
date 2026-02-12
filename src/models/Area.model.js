import mongoose from "mongoose";

const PolygonSchema = new mongoose.Schema({
  polygon: {
    type: [[Number]], // [[x, y], [x, y], ...]
    required: true
  }
}, { _id: false });

const PlotSchema = new mongoose.Schema({
  plotId: { type: String, required: true },
  plotNumber: { type: Number },
  ownerName: { type: String },

  polygons: {
    planned: PolygonSchema,
    occupied: PolygonSchema,
    unused: PolygonSchema,
    encroachment: PolygonSchema
  },

  compliance: {
    status: {
      type: String,
      enum: ["COMPLIANT", "PARTIAL", "ENCROACHED", "UNUSED"],
      required: true
    },
    deviationPercent: { type: Number, default: 0 },
    requiresManualReview: { type: Boolean, default: false }
  },

  mlMetadata: {
    confidenceScore: Number,
    segmentationModel: String,
    imageQuality: String
  }
}, { timestamps: true });

const AreaSchema = new mongoose.Schema({
  areaId: { type: String, required: true, unique: true },
  areaName: { type: String },

  satelliteImage: {
    imageId: String,
    source: String,
    capturedAt: Date,
    resolution: String,
    imageUrl: String
  },

  summary: {
    totalPlots: Number,
    compliantPlots: Number,
    encroachedPlots: Number,
    partiallyUsedPlots: Number,
    unusedPlots: Number
  },

  plots: [PlotSchema]
}, { timestamps: true });

export default mongoose.model("Area", AreaSchema);
