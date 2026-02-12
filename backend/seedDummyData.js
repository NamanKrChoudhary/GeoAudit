import mongoose from "mongoose";
import dotenv from "dotenv";
import Area from "./src/models/Area.model.js";

dotenv.config();

// Helper to calculate dummy area in SqM based on coordinates
const calcArea = (coords) => Math.abs(coords.length * 450); // Simulation

const dummyData = [
  {
    areaId: "IND_ZONE_1023",
    areaName: "Siltara Industrial Estate Phase-II",
    satelliteImage: {
      imageUrl:
        "https://res.cloudinary.com/dtcde3gnt/image/upload/v1770884616/geo-audit/satellite/tdi2lf74brciaiwpklsk.jpg",
      capturedAt: new Date(),
    },
    summary: {
      totalPlots: 2,
      compliantPlots: 1,
      encroachedPlots: 1,
      unusedPlots: 0,
      overallComplianceScore: 50.0,
    },
    plots: [
      {
        plotId: "PLOT_A1",
        ownerName: "Adani Enterprises",
        ownerEmail: "admin@adani.com",
        plotNumber: "A-101",
        polygons: {
          intended: {
            polygon: [
              [21.365, 81.695],
              [21.367, 81.695],
              [21.367, 81.697],
              [21.365, 81.697],
            ],
            areaSqM: 4000,
          },
          existing: {
            polygon: [
              [21.365, 81.695],
              [21.367, 81.695],
              [21.367, 81.697],
              [21.365, 81.697],
            ],
            areaSqM: 4000,
          },
          encroached: { polygon: [], areaSqM: 0 },
          unused: { polygon: [], areaSqM: 0 },
        },
        compliance: { status: "COMPLIANT", deviationPercent: 0 },
      },
      {
        plotId: "PLOT_B2",
        ownerName: "Jindal Steel & Power",
        ownerEmail: "legal@jindal.com",
        plotNumber: "B-205",
        polygons: {
          intended: {
            polygon: [
              [21.37, 81.7],
              [21.372, 81.7],
              [21.372, 81.702],
              [21.37, 81.702],
            ],
            areaSqM: 4000,
          },
          existing: {
            polygon: [
              [21.37, 81.7],
              [21.372, 81.7],
              [21.372, 81.704],
              [21.37, 81.704],
            ], // Pushed outward
            areaSqM: 4800,
          },
          encroached: {
            polygon: [
              [21.37, 81.702],
              [21.372, 81.702],
              [21.372, 81.704],
              [21.37, 81.704],
            ],
            areaSqM: 800,
          },
          unused: { polygon: [], areaSqM: 0 },
        },
        compliance: { status: "ENCROACHED", deviationPercent: 20 },
      },
    ],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to Atlas for Seeding...");

    await Area.deleteMany({}); // CLEAR OLD DATA
    await Area.insertMany(dummyData);

    console.log("✅ Intelligence Dummy Data Seeded Successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedDB();
