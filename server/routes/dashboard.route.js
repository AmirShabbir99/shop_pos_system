import express from "express";
import { authorizeRoles, protect } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/cashier",
  protect,
  authorizeRoles("cashier", "manager", "admin"),
  (req, res) => {
    res.json({
      title: "Cashier Dashboard",
      stats: {
        salesToday: 18,
        revenueToday: 24500,
        receiptsIssued: 18,
      },
      recentSales: [
        { id: 1, invoice: "INV-001", total: 1200 },
        { id: 2, invoice: "INV-002", total: 3400 },
      ],
    });
  }
);

router.get(
  "/manager",
  protect,
  authorizeRoles("manager", "admin"),
  (req, res) => {
    res.json({
      title: "Manager Dashboard",
      stats: {
        totalProducts: 180,
        lowStockItems: 12,
        totalSalesToday: 27,
      },
      inventoryAlerts: [
        { id: 1, name: "Milk", stock: 4 },
        { id: 2, name: "Bread", stock: 7 },
      ],
    });
  }
);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      title: "Admin Dashboard",
      stats: {
        totalUsers: 9,
        totalManagers: 2,
        totalCashiers: 6,
      },
      systemStatus: "All systems normal",
    });
  }
);

export default router;