import mongoose from "mongoose";

const polygonSchema = new mongoose.Schema({
  polygon: { type: [[Number]], default: [] },
  areaSqM: { type: Number, default: 0 },
});

const AreaSchema = new mongoose.Schema(
  {
    areaId: { type: String, required: true, unique: true },
    areaName: { type: String, required: true },

    // Stores the satellite image (Real photo)
    satelliteImage: {
      imageId: String,
      imageUrl: String,
    },
    // Stores the plot map (The one with lines)
    plotMapImage: {
      imageId: String,
      imageUrl: String,
    },

    summary: {
      totalPlots: { type: Number, default: 0 },
      compliantPlots: { type: Number, default: 0 },
      encroachedPlots: { type: Number, default: 0 },
      unusedPlots: { type: Number, default: 0 },
      overallComplianceScore: { type: Number, default: 0 },
    },

    plots: [
      {
        plotId: { type: String, required: true },

        // --- KEPT THESE (CRITICAL FOR EMAIL & UI) ---
        ownerName: { type: String, default: "Unassigned" },
        ownerEmail: { type: String, default: "" },
        plotNumber: String,
        // --------------------------------------------

        // --- NEW FIELDS FOR ML API #2 & #3 ---
        isEncroached: { type: Boolean, default: false },
        usageStats: {
          constructedPercent: { type: Number, default: 0 },
          greeneryPercent: { type: Number, default: 0 },
        },
        // -------------------------------------

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
              "ENCROACHED",
              "WARNING_SENT",
              "PARTIAL",
              "UNUSED",
              "LEGAL_REVIEW",
            ],
            default: "COMPLIANT",
          },
          deviationPercent: { type: Number, default: 0 },
          actionHistory: [
            {
              actionType: String,
              timestamp: { type: Date, default: Date.now },
              details: String,
            },
          ],
        },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Area", AreaSchema);
