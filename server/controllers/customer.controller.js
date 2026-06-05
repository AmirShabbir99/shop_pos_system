import Customer from "../models/customer.model.js";

// GET all
export const getCustomers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 12, status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name:  { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;

    const total     = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .select("-transactions")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Summary
    const summary = await Customer.aggregate([
      {
        $group: {
          _id:          null,
          totalCustomers: { $sum: 1 },
          totalUdhaar:  { $sum: { $cond: [{ $gt: ["$balance", 0] }, "$balance", 0] } },
          withUdhaar:   { $sum: { $cond: [{ $gt: ["$balance", 0] }, 1, 0] } },
        },
      },
    ]);

    res.status(200).json({
      success: true, total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      customers,
      summary: summary[0] || { totalCustomers: 0, totalUdhaar: 0, withUdhaar: 0 },
    });
  } catch (error) { next(error); }
};

// GET single with transactions
export const getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id)
      .populate("transactions.saleRef", "saleNumber grandTotal");
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ success: true, customer });
  } catch (error) { next(error); }
};

// CREATE
export const createCustomer = async (req, res, next) => {
  try {
    const { name, phone, email, address, cnic } = req.body;
    if (!name)
      return res.status(400).json({ message: "Name is required" });

    const customer = await Customer.create({
      name, phone, email, address, cnic,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, customer });
  } catch (error) { next(error); }
};

// UPDATE
export const updateCustomer = async (req, res, next) => {
  try {
    const { name, phone, email, address, cnic, status } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, address, cnic, status },
      { new: true, runValidators: true }
    );
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ success: true, customer });
  } catch (error) { next(error); }
};

// DELETE
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { next(error); }
};

// ADD TRANSACTION (udhaar / payment)
export const addCustomerTransaction = async (req, res, next) => {
  try {
    const { type, amount, description } = req.body;
    if (!type || !amount)
      return res.status(400).json({ message: "Type and amount required" });

    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    // balance update
    if (type === "sale" || type === "credit") {
      customer.balance += Number(amount); // customer pe udhaar barha
    } else if (type === "payment") {
      customer.balance -= Number(amount); // customer ne pay kiya
    }

    customer.transactions.push({ type, amount, description, date: new Date() });
    await customer.save();

    res.status(200).json({ success: true, customer });
  } catch (error) { next(error); }
};