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
        satelliteImage: {
          imageId: "IMG_ALPHA_001",
          source: "satellite",
          capturedAt: new Date("2026-02-10T10:00:00Z"),
          resolution: "0.5m",
          imageUrl: "alpha_zone.png"
        },
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
            },
            mlMetadata: {
              confidenceScore: 0.95,
              segmentationModel: "dummy-model-v1",
              imageQuality: "GOOD"
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
            },
            mlMetadata: {
              confidenceScore: 0.87,
              segmentationModel: "dummy-model-v1",
              imageQuality: "FAIR"
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
            },
            mlMetadata: {
              confidenceScore: 0.91,
              segmentationModel: "dummy-model-v1",
              imageQuality: "GOOD"
            }
          }
        ]
      },
      {
        areaId: "IND_ZONE_1002",
        areaName: "Industrial Zone Beta",
        satelliteImage: {
          imageId: "IMG_BETA_002",
          source: "drone",
          capturedAt: new Date("2026-02-09T09:30:00Z"),
          resolution: "0.3m",
          imageUrl: "beta_zone.png"
        },
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
            },
            mlMetadata: {
              confidenceScore: 0.89,
              segmentationModel: "dummy-model-v1",
              imageQuality: "POOR"
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
            },
            mlMetadata: {
              confidenceScore: 0.93,
              segmentationModel: "dummy-model-v1",
              imageQuality: "GOOD"
            }
          }
        ]
      },
      {
        areaId: "IND_ZONE_1003",
        areaName: "Industrial Zone Gamma",
        satelliteImage: {
          imageId: "IMG_GAMMA_003",
          source: "satellite",
          capturedAt: new Date("2026-02-11T08:45:00Z"),
          resolution: "0.5m",
          imageUrl: "gamma_zone.png"
        },
        summary: {
          totalPlots: 3,
          compliantPlots: 1,
          encroachedPlots: 1,
          partiallyUsedPlots: 0,
          unusedPlots: 1
        },
        plots: [
          {
            plotId: "PLOT_G1",
            plotNumber: 1,
            ownerName: "Orion Heavy Industries",
            polygons: {
              planned: { polygon: [[100,100],[160,100],[160,160],[100,160]] },
              occupied: { polygon: [[105,105],[155,105],[155,155],[105,155]] },
              unused: { polygon: [] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "COMPLIANT",
              deviationPercent: 2.1,
              requiresManualReview: false
            },
            mlMetadata: {
              confidenceScore: 0.94,
              segmentationModel: "dummy-model-v1",
              imageQuality: "GOOD"
            }
          },
          {
            plotId: "PLOT_G2",
            plotNumber: 2,
            ownerName: "Nova Chemicals Ltd",
            polygons: {
              planned: { polygon: [[200,100],[260,100],[260,160],[200,160]] },
              occupied: { polygon: [[195,95],[265,95],[265,165],[195,165]] },
              unused: { polygon: [] },
              encroachment: { polygon: [[195,95],[200,95],[200,100]] }
            },
            compliance: {
              status: "ENCROACHED",
              deviationPercent: 9.4,
              requiresManualReview: true
            },
            mlMetadata: {
              confidenceScore: 0.88,
              segmentationModel: "dummy-model-v1",
              imageQuality: "FAIR"
            }
          },
          {
            plotId: "PLOT_G3",
            plotNumber: 3,
            ownerName: "Zenith Logistics Park",
            polygons: {
              planned: { polygon: [[300,100],[360,100],[360,160],[300,160]] },
              occupied: { polygon: [] },
              unused: { polygon: [[300,100],[360,100],[360,160],[300,160]] },
              encroachment: { polygon: [] }
            },
            compliance: {
              status: "UNUSED",
              deviationPercent: 100,
              requiresManualReview: false
            },
            mlMetadata: {
              confidenceScore: 0.91,
              segmentationModel: "dummy-model-v1",
              imageQuality: "GOOD"
            }
          }
        ]
      }
    ];

    await Area.insertMany(areas);

    console.log("✅ Dummy data seeded successfully (3 areas)");
    process.exit();
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedData();
