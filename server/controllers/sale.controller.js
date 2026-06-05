import Sale from "../models/sale.model.js";
import Product from "../models/product.model.js";

// CREATE sale
export const createSale = async (req, res, next) => {
  try {
    const {
      items, subtotal, discount, discountType,
      tax, grandTotal, paymentMethod, cashReceived, changeReturn,
    } = req.body;

    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items in sale" });

    // Stock deduct karo
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product)
        return res.status(404).json({ message: `Product not found: ${item.name}` });
      if (product.stock < item.quantity)
        return res.status(400).json({ message: `Insufficient stock for: ${product.name}` });

      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const sale = await Sale.create({
      items, subtotal, discount, discountType,
      tax, grandTotal, paymentMethod,
      cashReceived, changeReturn,
      cashier: req.user._id,
    });

    const populated = await sale.populate("cashier", "name");
    res.status(201).json({ success: true, sale: populated });
  } catch (error) {
    next(error);
  }
};

// GET all sales
export const getSales = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;

    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const total = await Sale.countDocuments(query);
    const sales = await Sale.find(query)
      .populate("cashier", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, sales });
  } catch (error) {
    next(error);
  }
};

// GET single sale
export const getSale = async (req, res, next) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("cashier", "name");
    if (!sale) return res.status(404).json({ message: "Sale not found" });
    res.status(200).json({ success: true, sale });
  } catch (error) {
    next(error);
  }
};

// Sales summary for history page
export const getSalesSummary = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [todayStats, allTime] = await Promise.all([
      Sale.aggregate([
        { $match: { createdAt: { $gte: today, $lt: tomorrow }, status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
      Sale.aggregate([
        { $match: { status: "completed" } },
        { $group: { _id: null, total: { $sum: "$grandTotal" }, count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      success: true,
      todayRevenue: todayStats[0]?.total || 0,
      todayOrders:  todayStats[0]?.count || 0,
      allRevenue:   allTime[0]?.total    || 0,
      allOrders:    allTime[0]?.count    || 0,
    });
  } catch (error) {
    next(error);
  }
};