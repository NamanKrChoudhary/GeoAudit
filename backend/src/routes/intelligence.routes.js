import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";
import {
  processLandPlan,
  getAreaIntelligence,
} from "../controllers/intelligence.controller.js";
import { handleAction } from "../controllers/report.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temp storage for files

// Dashboard Data
router.get("/summary/:areaId", protect, getAreaIntelligence);

// Report Actions (PDF/Email)
router.post("/action", protect, handleAction);

/**
 * @route   POST /api/intelligence/process-plan
 * @desc    Uploads 2 Images -> Runs 3 ML Models -> Saves Intelligence to DB
 * @access  Private
 */
router.post(
  "/process-plan",
  protect,
  upload.fields([
    { name: "plotImage", maxCount: 1 }, // The map with lines
    { name: "satelliteImage", maxCount: 1 }, // The raw satellite photo
  ]),
  processLandPlan,
);

export default router;
