import mongoose from "mongoose";

// Sub-schema for individual geometric shapes
const polygonSchema = new mongoose.Schema({
  polygon: { type: [[Number]], default: [] }, // Array of [lat, lng]
  areaSqM: { type: Number, default: 0 }, // Square meters for metrics
});

const AreaSchema = new mongoose.Schema({
  areaId: { type: String, required: true, unique: true },
  areaName: { type: String, required: true },

  satelliteImage: {
    imageId: String, // Cloudinary ID
    imageUrl: String, // Cloudinary URL
    capturedAt: { type: Date, default: Date.now },
  },

  summary: {
    totalPlots: { type: Number, default: 0 },
    compliantPlots: { type: Number, default: 0 },
    encroachedPlots: { type: Number, default: 0 },
    unusedPlots: { type: Number, default: 0 },
    overallComplianceScore: { type: Number, default: 0 }, // For "Bamboozle" Dashboard
  },

  plots: [
    {
      plotId: { type: String, required: true },
      ownerName: String,
      ownerEmail: String, // Added for Automated Email feature
      plotNumber: String,

      // NEW: Geometry for Frontend Shading/Clipping
      polygons: {
        intended: { type: polygonSchema, default: () => ({}) },
        existing: { type: polygonSchema, default: () => ({}) },
        encroached: { type: polygonSchema, default: () => ({}) },
        unused: { type: polygonSchema, default: () => ({}) },
      },

      compliance: {
        status: {
          type: String,
          enum: [
            "COMPLIANT",
            "PARTIAL",
            "ENCROACHED",
            "UNUSED",
            "LEGAL_REVIEW",
            "WARNING_SENT",
          ],
          default: "COMPLIANT",
        },
        deviationPercent: { type: Number, default: 0 },
        requiresManualReview: { type: Boolean, default: false },

        // NEW: Action Log for Admin Reports
        actionHistory: [
          {
            actionType: String, // e.g., "REPORT_SENT_TO_ADMIN"
            timestamp: { type: Date, default: Date.now },
            details: String,
          },
        ],
      },
    },
  ],
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Area", AreaSchema);
