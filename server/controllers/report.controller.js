import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";
import Category from "../models/category.model.js";

// ─── Sales Report ──────────────────────────────────────────
export const getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end   = endDate   ? new Date(endDate)   : new Date();
    end.setHours(23, 59, 59, 999);

    const formatMap = {
      day:   "%Y-%m-%d",
      week:  "%Y-W%V",
      month: "%Y-%m",
    };

    const [summary, chartData, paymentBreakdown, topProducts, topCategories] = await Promise.all([

      // Summary totals
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        {
          $group: {
            _id: null,
            totalRevenue:  { $sum: "$grandTotal" },
            totalOrders:   { $sum: 1 },
            totalDiscount: { $sum: "$discount" },
            totalTax:      { $sum: "$tax" },
            avgOrderValue: { $avg: "$grandTotal" },
          },
        },
      ]),

      // Chart data grouped by day/week/month
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        {
          $group: {
            _id:     { $dateToString: { format: formatMap[groupBy], date: "$createdAt" } },
            revenue: { $sum: "$grandTotal" },
            orders:  { $sum: 1 },
            discount:{ $sum: "$discount" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Payment method breakdown
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        {
          $group: {
            _id:     "$paymentMethod",
            total:   { $sum: "$grandTotal" },
            count:   { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),

      // Top products
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        { $unwind: "$items" },
        {
          $group: {
            _id:       "$items.name",
            qty:       { $sum: "$items.quantity" },
            revenue:   { $sum: "$items.total" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 10 },
      ]),

      // Top categories
      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productInfo",
          },
        },
        { $unwind: { path: "$productInfo", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "categories",
            localField: "productInfo.category",
            foreignField: "_id",
            as: "categoryInfo",
          },
        },
        { $unwind: { path: "$categoryInfo", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:     "$categoryInfo.name",
            revenue: { $sum: "$items.total" },
            qty:     { $sum: "$items.quantity" },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 8 },
      ]),
    ]);

    res.status(200).json({
      success: true,
      summary: summary[0] || {
        totalRevenue: 0, totalOrders: 0,
        totalDiscount: 0, totalTax: 0, avgOrderValue: 0,
      },
      chartData,
      paymentBreakdown,
      topProducts,
      topCategories,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Inventory Report ──────────────────────────────────────
export const getInventoryReport = async (req, res, next) => {
  try {
    const [products, categoryWise, stockSummary] = await Promise.all([

      Product.find()
        .populate("category", "name")
        .select("name stock lowStockAlert salePrice purchasePrice unit category status")
        .sort({ stock: 1 }),

      Product.aggregate([
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "cat",
          },
        },
        { $unwind: { path: "$cat", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:        "$cat.name",
            totalStock: { $sum: "$stock" },
            totalValue: { $sum: { $multiply: ["$stock", "$salePrice"] } },
            count:      { $sum: 1 },
          },
        },
        { $sort: { totalValue: -1 } },
      ]),

      Product.aggregate([
        {
          $group: {
            _id: null,
            totalProducts:  { $sum: 1 },
            totalStockValue:{ $sum: { $multiply: ["$stock", "$salePrice"] } },
            outOfStock:     { $sum: { $cond: [{ $eq: ["$stock", 0] }, 1, 0] } },
            lowStock:       {
              $sum: {
                $cond: [
                  { $and: [{ $gt: ["$stock", 0] }, { $lte: ["$stock", "$lowStockAlert"] }] },
                  1, 0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      summary: stockSummary[0] || {},
      products,
      categoryWise,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Profit Report ─────────────────────────────────────────
export const getProfitReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end   = endDate   ? new Date(endDate)   : new Date();
    end.setHours(23, 59, 59, 999);

    const [profitByProduct, dailyProfit, summary] = await Promise.all([

      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:          "$items.name",
            revenue:      { $sum: "$items.total" },
            qty:          { $sum: "$items.quantity" },
            costPrice:    { $first: "$productData.purchasePrice" },
          },
        },
        {
          $addFields: {
            totalCost:  { $multiply: ["$costPrice", "$qty"] },
            profit:     { $subtract: ["$revenue", { $multiply: ["$costPrice", "$qty"] }] },
          },
        },
        { $sort: { profit: -1 } },
        { $limit: 10 },
      ]),

      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:     { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$items.total" },
            cost:    { $sum: { $multiply: ["$productData.purchasePrice", "$items.quantity"] } },
          },
        },
        {
          $addFields: {
            profit: { $subtract: ["$revenue", "$cost"] },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      Sale.aggregate([
        { $match: { createdAt: { $gte: start, $lte: end }, status: "completed" } },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.product",
            foreignField: "_id",
            as: "productData",
          },
        },
        { $unwind: { path: "$productData", preserveNullAndEmptyArrays: true } },
        {
          $group: {
            _id:         null,
            totalRevenue:{ $sum: "$items.total" },
            totalCost:   { $sum: { $multiply: ["$productData.purchasePrice", "$items.quantity"] } },
          },
        },
        {
          $addFields: {
            totalProfit: { $subtract: ["$totalRevenue", "$totalCost"] },
            margin: {
              $multiply: [
                { $divide: [{ $subtract: ["$totalRevenue", "$totalCost"] }, "$totalRevenue"] },
                100,
              ],
            },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      summary: summary[0] || { totalRevenue: 0, totalCost: 0, totalProfit: 0, margin: 0 },
      profitByProduct,
      dailyProfit,
    });
  } catch (error) {
    next(error);
  }
};