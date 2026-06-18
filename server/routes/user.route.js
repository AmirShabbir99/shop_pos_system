import express from "express";
import {
  loginUser, registerUser, logoutUser, getMe,
  getUsers, updateUser, deleteUser,
  resetUserPassword, updateProfile, changePassword,
} from "../controllers/user.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.js";

const router = express.Router();

router.post("/login",   loginUser);
router.post("/logout",  logoutUser);
router.get("/me",       protect, getMe);
router.put("/profile",  protect, updateProfile);
router.put("/change-password", protect, changePassword);

// Admin only access
router.post("/register",              protect, authorizeRoles("admin"), registerUser);
router.get("/",                       protect, authorizeRoles("admin"), getUsers);
router.put("/:id",                    protect, authorizeRoles("admin"), updateUser);
router.delete("/:id",                 protect, authorizeRoles("admin"), deleteUser);
router.put("/:id/reset-password",     protect, authorizeRoles("admin"), resetUserPassword);

export default router;