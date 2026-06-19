import Supplier from "../models/supplier.model.js";
// supplier controller
export const getSuppliers = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 12, status } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name:    { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { phone:   { $regex: search, $options: "i" } },
      ];
    }
    if (status) query.status = status;

    const total     = await Supplier.countDocuments(query);
    const suppliers = await Supplier.find(query)
      .select("-transactions")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const summary = await Supplier.aggregate([
      {
        $group: {
          _id:            null,
          totalSuppliers: { $sum: 1 },
          totalPayable:   { $sum: { $cond: [{ $gt: ["$balance", 0] }, "$balance", 0] } },
          withPayable:    { $sum: { $cond: [{ $gt: ["$balance", 0] }, 1, 0] } },
        },
      },
    ]);

    res.status(200).json({
      success: true, total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      suppliers,
      summary: summary[0] || { totalSuppliers: 0, totalPayable: 0, withPayable: 0 },
    });
  } catch (error) { next(error); }
};

export const getSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ success: true, supplier });
  } catch (error) { next(error); }
};

export const createSupplier = async (req, res, next) => {
  try {
    const { name, phone, email, address, company } = req.body;
    if (!name)
      return res.status(400).json({ message: "Name is required" });

    const supplier = await Supplier.create({
      name, phone, email, address, company,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, supplier });
  } catch (error) { next(error); }
};

export const updateSupplier = async (req, res, next) => {
  try {
    const { name, phone, email, address, company, status } = req.body;
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { name, phone, email, address, company, status },
      { new: true, runValidators: true }
    );
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ success: true, supplier });
  } catch (error) { next(error); }
};

export const deleteSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });
    res.status(200).json({ success: true, message: "Deleted" });
  } catch (error) { next(error); }
};

export const addSupplierTransaction = async (req, res, next) => {
  try {
    const { type, amount, description } = req.body;
    if (!type || !amount)
      return res.status(400).json({ message: "Type and amount required" });

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier)
      return res.status(404).json({ message: "Supplier not found" });

    if (type === "purchase") {
      supplier.balance += Number(amount); // unhe dene hain
    } else if (type === "payment") {
      supplier.balance -= Number(amount); // hum ne de diya
    }

    supplier.transactions.push({ type, amount, description, date: new Date() });
    await supplier.save();

    res.status(200).json({ success: true, supplier });
  } catch (error) { next(error); }
};