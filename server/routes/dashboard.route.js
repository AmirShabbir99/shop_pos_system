import express from "express";
import {
  getAdminStats,
  getManagerStats,
  getCashierStats,
} from "../controllers/dashboard.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.get("/admin",   authorizeRoles("admin"),             getAdminStats);
router.get("/manager", authorizeRoles("admin", "manager"),  getManagerStats);
router.get("/cashier", authorizeRoles("cashier", "admin", "manager"), getCashierStats);

export default router;