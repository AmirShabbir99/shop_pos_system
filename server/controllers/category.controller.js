import Category from "../models/category.model.js";

// GET all categories
export const getCategories = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 10 } = req.query;

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const total = await Category.countDocuments(query);
    const categories = await Category.find(query)
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      categories,
    });
  } catch (error) {
    next(error);
  }
};

// GET single category
export const getCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// CREATE category
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    if (!name)
      return res.status(400).json({ message: "Category name is required" });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name,
      description,
      status,
      createdBy: req.user._id,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// UPDATE category
export const updateCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true, runValidators: true }
    );

    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// DELETE category
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.status(200).json({ success: true, message: "Category deleted" });
  } catch (error) {
    next(error);
  }
};