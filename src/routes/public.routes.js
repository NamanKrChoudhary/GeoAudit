import express from "express";
import {
  getAllAreas,
  getAreaById,
  getDashboardStats,
  getPlotById
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/areas", getAllAreas);
router.get("/areas/:areaId", getAreaById);
router.get("/areas/:areaId/plots/:plotId", getPlotById);
router.get("/stats", getDashboardStats);

export default router;
