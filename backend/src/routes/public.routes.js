import express from "express";
import {
  getAllAreas,
  getAreaById,
  getDashboardStats
} from "../controllers/public.controller.js";

const router = express.Router();

router.get("/areas", getAllAreas);
router.get("/areas/:areaId", getAreaById);
router.get("/stats", getDashboardStats);

export default router;
