import express from "express";
import {
  getCustomers, getCustomer, createCustomer,
  updateCustomer, deleteCustomer, addCustomerTransaction,
} from "../controllers/customer.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();
router.use(protect);
router.get("/",                    getCustomers);
router.get("/:id",                 getCustomer);
router.post("/",                   authorizeRoles("admin", "manager", "cashier"), createCustomer);
router.put("/:id",                 authorizeRoles("admin", "manager"), updateCustomer);
router.delete("/:id",              authorizeRoles("admin"), deleteCustomer);
router.post("/:id/transaction",    addCustomerTransaction);

export default router;