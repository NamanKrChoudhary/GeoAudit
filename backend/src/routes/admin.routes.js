import express from "express";
import multer from "multer";
import { protect } from "../middlewares/auth.middleware.js";
import { adminOnly } from "../middlewares/role.middleware.js";
import {
  scanArea,
  deleteArea,
  toggleEncroachmentFlag
} from "../controllers/admin.controller.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Admin-only scan endpoint
router.post(
  "/scan",
  protect,
  adminOnly,
  upload.fields([
    { name: "satelliteImage", maxCount: 1 },
    { name: "plannedImage", maxCount: 1 }
  ]),
  scanArea
);

// Admin-only delete area
router.delete("/areas/:areaId", protect, adminOnly, deleteArea);

// Admin-only toggle flags (encroachment/manual review)
router.patch(
  "/plots/:areaId/:plotId/flags",
  protect,
  adminOnly,
  toggleEncroachmentFlag
);

export default router;
