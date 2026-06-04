import express from "express";
import {
  getProducts, getProduct,
  createProduct, updateProduct, deleteProduct,
} from "../controllers/product.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

router.use(protect);

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authorizeRoles("admin", "manager"), upload.single("image"), createProduct);
router.put("/:id", authorizeRoles("admin", "manager"), upload.single("image"), updateProduct);
router.delete("/:id", authorizeRoles("admin"), deleteProduct);

export default router;