import express from "express";
import { getAreaIntelligence } from "../controllers/intelligence.controller.js";
import { handleAction } from "../controllers/report.controller.js";
// We only import 'protect' now
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   GET /api/intelligence/summary/:areaId
 * @desc    Provides 4-layer polygons and metrics
 * @access  Private (Any Logged-in User)
 */
// REMOVED 'adminOnly'
router.get("/summary/:areaId", protect, getAreaIntelligence);

/**
 * @route   POST /api/intelligence/action
 * @desc    Triggers PDF generation and Email dispatch
 * @access  Private (Any Logged-in User)
 */
// REMOVED 'adminOnly'
router.post("/action", protect, handleAction);

export default router;
