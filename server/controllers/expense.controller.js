import Expense from "../models/expense.model.js";

export const getExpenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 15, category, startDate, endDate, search = "" } = req.query;

    const query = {};
    if (category) query.category = category;
    if (search)   query.title = { $regex: search, $options: "i" };
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const [total, expenses, summary] = await Promise.all([
      Expense.countDocuments(query),
      Expense.find(query)
        .populate("createdBy", "name")
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Expense.aggregate([
        { $match: query },
        {
          $group: {
            _id:   "$category",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]),
    ]);

    const grandTotal = expenses.reduce ? null : 0;
    const totalAmount = await Expense.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      expenses,
      summary,
      totalAmount: totalAmount[0]?.total || 0,
    });
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    const { title, amount, category, description, date } = req.body;
    if (!title || !amount)
      return res.status(400).json({ message: "Title and amount are required" });

    const expense = await Expense.create({
      title, amount, category, description,
      date: date || Date.now(),
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

export const updateExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!expense)
      return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, expense });
  } catch (error) {
    next(error);
  }
};

export const deleteExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense)
      return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) {
    next(error);
  }
};