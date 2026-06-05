import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { createSale, getSales, getSale, getSalesSummary } from "../controllers/sale.controller.js";

const router = express.Router();

router.use(protect);
router.post("/", authorizeRoles("cashier", "admin", "manager"), createSale);
router.get("/", authorizeRoles("admin", "manager"), getSales);
router.get("/:id", getSale);
router.get("/summary", getSalesSummary);

export default router;