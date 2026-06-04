import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";
import User from "../models/user.model.js";

// ─── Admin Dashboard ───────────────────────────────────────
export const getAdminStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth  = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // Basic counts
    const [totalProducts, totalCategories, totalUsers] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      User.countDocuments(),
    ]);

    // Revenue
    const [todaySales, monthSales, totalRevenue] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { createdAt: { $gte: firstDayOfMonth, $lte: lastDayOfMonth }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" } } },
      ]),
    ]);

    // Last 7 days sales chart
    const last7Days = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Last 6 months
    const last6Months = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Payment method breakdown
    const paymentBreakdown = await Sale.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: "$paymentMethod", total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
    ]);

    // Top selling products
    const topProducts = await Sale.aggregate([
      { $unwind: "$items" },
      { $group: { _id: "$items.name", totalQty: { $sum: "$items.quantity" }, totalRev: { $sum: "$items.total" } } },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    // Low stock products
    const lowStock = await Product.find({
      $expr: { $lte: ["$stock", "$lowStockAlert"] },
    }).select("name stock lowStockAlert unit image").limit(5);

    // Recent sales
    const recentSales = await Sale.find({ status: "completed" })
      .populate("cashier", "name")
      .sort({ createdAt: -1 })
      .limit(8);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        totalUsers,
        todayRevenue:  todaySales[0]?.total  || 0,
        todayOrders:   todaySales[0]?.count  || 0,
        monthRevenue:  monthSales[0]?.total  || 0,
        monthOrders:   monthSales[0]?.count  || 0,
        totalRevenue:  totalRevenue[0]?.total || 0,
      },
      charts: { last7Days, last6Months, paymentBreakdown },
      topProducts,
      lowStock,
      recentSales,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Manager Dashboard ─────────────────────────────────────
export const getManagerStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [todaySales, monthSales, lowStock, recentSales] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { createdAt: { $gte: firstDayOfMonth }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Product.find({ $expr: { $lte: ["$stock", "$lowStockAlert"] } })
        .select("name stock lowStockAlert unit")
        .limit(8),
      Sale.find().populate("cashier", "name").sort({ createdAt: -1 }).limit(10),
    ]);

    const last7Days = await Sale.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        todayRevenue: todaySales[0]?.total || 0,
        todayOrders:  todaySales[0]?.count || 0,
        monthRevenue: monthSales[0]?.total || 0,
        monthOrders:  monthSales[0]?.count || 0,
        lowStockCount: lowStock.length,
      },
      charts: { last7Days },
      lowStock,
      recentSales,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Cashier Dashboard ─────────────────────────────────────
export const getCashierStats = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todaySales, myTodaySales, recentMySales] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        {
          $match: {
            createdAt: { $gte: today, $lt: tomorrow },
            cashier: req.user._id,
            status: "completed",
          },
        },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.find({ cashier: req.user._id })
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        myTodayRevenue: myTodaySales[0]?.total || 0,
        myTodayOrders:  myTodaySales[0]?.count || 0,
        totalTodayRevenue: todaySales[0]?.total || 0,
        totalTodayOrders:  todaySales[0]?.count || 0,
      },
      recentMySales,
    });
  } catch (error) {
    next(error);
  }
};