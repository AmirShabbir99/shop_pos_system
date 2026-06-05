import express from "express";
import {
  getSuppliers, getSupplier, createSupplier,
  updateSupplier, deleteSupplier, addSupplierTransaction,
} from "../controllers/supplier.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(protect, authorizeRoles("admin", "manager"));
router.get("/",                   getSuppliers);
router.get("/:id",                getSupplier);
router.post("/",                  createSupplier);
router.put("/:id",                updateSupplier);
router.delete("/:id",             deleteSupplier);
router.post("/:id/transaction",   addSupplierTransaction);

export default router;