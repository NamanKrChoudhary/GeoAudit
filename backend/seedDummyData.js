import mongoose from "mongoose";
import dotenv from "dotenv";
import Area from "./src/models/Area.model.js";
import connectDB from "./src/config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await Area.deleteMany({}); // Clear old data

    const areas = [
      {
        areaId: "IND_ZONE_1001",
        areaName: "Industrial Zone Alpha",
        summary: {
          totalPlots: 3,
          compliantPlots: 1,
          encroachedPlots: 1,
          partiallyUsedPlots: 1,
          unusedPlots: 0
        },
        plots: [
          {
            plotId: "PLOT_A1",
            plotNumber: 1,
            ownerName: "Alpha Steel Pvt Ltd",
            polygons: {
              planned: { polygon: [[10,10],[20,10],[20,20],[10,20]] },
              occupied: { polygon: [[11,11],[19,11],[19,19],[11,19]] },
              unused: { polygon: [] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "COMPLIANT",
              deviationPercent: 1.2,
              requiresManualReview: false
            }
          },
          {
            plotId: "PLOT_A2",
            plotNumber: 2,
            ownerName: "Beta Motors",
            polygons: {
              planned: { polygon: [[30,10],[40,10],[40,20],[30,20]] },
              occupied: { polygon: [[28,9],[42,21],[35,18]] },
              unused: { polygon: [] },
              encroachment: { polygon: [[42,21],[45,22],[43,25]] }
            },
            compliance: {
              status: "ENCROACHED",
              deviationPercent: 12.5,
              requiresManualReview: true
            }
          },
          {
            plotId: "PLOT_A3",
            plotNumber: 3,
            ownerName: "Gamma Plastics",
            polygons: {
              planned: { polygon: [[50,10],[60,10],[60,20],[50,20]] },
              occupied: { polygon: [[50,10],[55,10],[55,20]] },
              unused: { polygon: [[55,10],[60,10],[60,20],[55,20]] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "PARTIAL",
              deviationPercent: 20.0,
              requiresManualReview: false
            }
          }
        ]
      },
      {
        areaId: "IND_ZONE_1002",
        areaName: "Industrial Zone Beta",
        summary: {
          totalPlots: 2,
          compliantPlots: 0,
          encroachedPlots: 0,
          partiallyUsedPlots: 0,
          unusedPlots: 2
        },
        plots: [
          {
            plotId: "PLOT_B1",
            plotNumber: 1,
            ownerName: "Delta Infra",
            polygons: {
              planned: { polygon: [[10,30],[20,30],[20,40],[10,40]] },
              occupied: { polygon: [] },
              unused: { polygon: [[10,30],[20,30],[20,40],[10,40]] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "UNUSED",
              deviationPercent: 100,
              requiresManualReview: true
            }
          },
          {
            plotId: "PLOT_B2",
            plotNumber: 2,
            ownerName: "Epsilon Textiles",
            polygons: {
              planned: { polygon: [[30,30],[40,30],[40,40],[30,40]] },
              occupied: { polygon: [] },
              unused: { polygon: [[30,30],[40,30],[40,40],[30,40]] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "UNUSED",
              deviationPercent: 100,
              requiresManualReview: false
            }
          }
        ]
      }
    ];

    await Area.insertMany(areas);

    console.log("✅ Dummy data seeded successfully");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
