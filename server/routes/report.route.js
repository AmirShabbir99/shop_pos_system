import express from "express";
import {
  getSalesReport,
  getInventoryReport,
  getProfitReport,
} from "../controllers/report.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
//report routes
router.use(protect, authorizeRoles("admin", "manager"));
router.get("/sales",     getSalesReport);
router.get("/inventory", getInventoryReport);
router.get("/profit",    getProfitReport);

export default router;