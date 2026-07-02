import express from "express";
import {
  getExpenses, createExpense,
  updateExpense, deleteExpense,
} from "../controllers/expense.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

//expense route

const router = express.Router();
router.use(protect, authorizeRoles("admin", "manager"));
router.get("/",     getExpenses);
router.post("/",    createExpense);
router.put("/:id",  updateExpense);
router.delete("/:id", deleteExpense);

export default router;