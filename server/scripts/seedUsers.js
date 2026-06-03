import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/user.model.js";

dotenv.config();
connectDB();

const seedUsers = async () => {
  try {
    await User.deleteMany({
      email: {
        $in: [
          "cashier@pos.com",
          "manager@pos.com",
          "admin@pos.com",
        ],
      },
    });

    const password = await bcryptjs.hash("123456", 12);

    await User.create([
      {
        name: "Cashier User",
        email: "cashier@pos.com",
        password,
        role: "cashier",
      },
      {
        name: "Manager User",
        email: "manager@pos.com",
        password,
        role: "manager",
      },
      {
        name: "Admin User",
        email: "admin@pos.com",
        password,
        role: "admin",
      },
    ]);

    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedUsers();