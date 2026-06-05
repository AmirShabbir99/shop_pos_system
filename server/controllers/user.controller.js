import bcryptjs from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt_token.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
});


// ================= LOGIN =================
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
console.log("First")
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcryptjs.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

  return generateToken(user, "Login successful", 200, res);
  } catch (error) {
    next(error);
  }
};


// ================= REGISTER =================
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "cashier",
    });

    return generateToken(
      sanitizeUser(user),
      "User registered successfully",
      201,
      res
    );
  } catch (error) {
    next(error);
  }
};


// ================= GET ME =================
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
};


// ================= LOGOUT =================
export const logoutUser = async (req, res) => {
  return res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })
    .status(200)
    .json({
      success: true,
      message: "Logged out successfully",
    });
};
























// GET all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10, role } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (role)   query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true, total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    next(error);
  }
};

// UPDATE user
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// DELETE user
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString())
      return res.status(400).json({ message: "Apna account delete nahi kar sakte!" });

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({ success: true, message: "User deleted" });
  } catch (error) {
    next(error);
  }
};

// RESET password (admin)
export const resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ message: "Password minimum 6 characters hona chahiye" });

    const hashed = await bcryptjs.hash(newPassword, 12);
    await User.findByIdAndUpdate(req.params.id, { password: hashed });

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    next(error);
  }
};

// UPDATE my profile
export const updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true }
    ).select("-password");

    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// CHANGE my password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");
    const isMatch = await bcryptjs.compare(currentPassword, user.password);

    if (!isMatch)
      return res.status(400).json({ message: "Current password galat hai" });

    user.password = await bcryptjs.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    next(error);
  }
};