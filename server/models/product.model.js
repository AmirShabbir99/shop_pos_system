import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    barcode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    purchasePrice: {
      type: Number,
      required: [true, "Purchase price is required"],
      min: 0,
    },
    salePrice: {
      type: Number,
      required: [true, "Sale price is required"],
      min: 0,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockAlert: {
      type: Number,
      default: 10,
    },
    unit: {
      type: String,
      enum: ["pcs", "kg", "g", "liter", "ml", "box", "dozen"],
      default: "pcs",
    },
    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);