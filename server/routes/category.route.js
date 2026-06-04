import express from "express";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // sab routes protected

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", authorizeRoles("admin", "manager"), createCategory);
router.put("/:id", authorizeRoles("admin", "manager"), updateCategory);
router.delete("/:id", authorizeRoles("admin"), deleteCategory);

export default router;