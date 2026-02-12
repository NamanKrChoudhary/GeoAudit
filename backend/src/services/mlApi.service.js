//import axios from "axios";
//import fs from "fs";
//import FormData from "form-data";
//
//export const callMLApi = async (satellitePath, plannedPath) => {
//  try {
//    const form = new FormData();
//    form.append("satelliteImage", fs.createReadStream(satellitePath));
//    form.append("plannedImage", fs.createReadStream(plannedPath));
//
//    const response = await axios.post(process.env.ML_API_URL, form, {
//      headers: {
//        ...form.getHeaders(),
//        Authorization: `Bearer ${process.env.ML_API_KEY}`
//      }
//    });
//
//    return response.data; // expected to contain plot polygons
//  } catch (err) {
//    console.error("ML API error:", err.message);
//    return null;
//  }
//};
export const callMLApi = async (satellitePath, plannedPath) => {
  // Temporary dummy ML response
  return {
    areaId: "IND_ZONE_1023",
    areaName: "RIICO Industrial Area Phase-2",
    plots: [
      {
        plotId: "PLOT_1",
        plotNumber: 1,
        ownerName: "ABC Manufacturing Pvt Ltd",
        polygons: {
          planned: { polygon: [[120,450],[135,460],[160,455]] },
          occupied: { polygon: [[125,455],[140,465],[165,460]] },
          unused: { polygon: [[110,490],[115,485],[145,495]] },
          encroachment: { polygon: [[170,475],[180,480],[165,460]] }
        },
        compliance: {
          status: "ENCROACHED",
          deviationPercent: 6.3,
          requiresManualReview: false
        },
        mlMetadata: {
          confidenceScore: 0.92,
          segmentationModel: "dummy-model-v1",
          imageQuality: "GOOD"
        }
      }
    ],
    summary: {
      totalPlots: 1,
      compliantPlots: 0,
      encroachedPlots: 1,
      partiallyUsedPlots: 0,
      unusedPlots: 0
    }
  };
};
