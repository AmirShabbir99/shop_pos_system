import express from "express";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.post("/register", protect, authorizeRoles("admin"), registerUser);

export default router;