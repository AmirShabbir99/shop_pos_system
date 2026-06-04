import Product from "../models/product.model.js";
import cloudinary from "../config/cloudinary.js";

// GET all products
export const getProducts = async (req, res, next) => {
  try {
    const { search = "", page = 1, limit = 12, category, status } = req.query;

    const query = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (category) query.category = category;
    if (status) query.status = status;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category", "name")
      .populate("createdBy", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (error) {
    next(error);
  }
};

// GET single product
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "name");

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// CREATE product
export const createProduct = async (req, res, next) => {
  try {
    const {
      name, barcode, category, purchasePrice,
      salePrice, stock, lowStockAlert, unit, status,
    } = req.body;
//  console.log("BODY:", req.body);
// console.log("FILE:", req.file);
// console.log("USER:", req.user);
    const image = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : { url: "", publicId: "" };

    const product = await Product.create({
      name, barcode, category, purchasePrice,
      salePrice, stock, lowStockAlert, unit,
      status, image, createdBy: req.user._id,
    });

    const populated = await product.populate("category", "name");
    res.status(201).json({ success: true, product: populated });
  } catch (error) {
    next(error);
  }
};

// UPDATE product
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Naya image upload hua toh purana delete karo
    if (req.file && product.image?.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    const image = req.file
      ? { url: req.file.path, publicId: req.file.filename }
      : product.image;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, image },
      { new: true, runValidators: true }
    ).populate("category", "name");

    res.status(200).json({ success: true, product: updated });
  } catch (error) {
    next(error);
  }
};

// DELETE product
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Cloudinary se image delete karo
    if (product.image?.publicId) {
      await cloudinary.uploader.destroy(product.image.publicId);
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    next(error);
  }
};