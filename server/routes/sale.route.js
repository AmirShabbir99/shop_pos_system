import express from "express";
import { createSale, getSales, getSale } from "../controllers/sale.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);
router.post("/", authorizeRoles("cashier", "admin", "manager"), createSale);
router.get("/", authorizeRoles("admin", "manager"), getSales);
router.get("/:id", getSale);

export default router;