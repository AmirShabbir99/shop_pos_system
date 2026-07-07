import mongoose from "mongoose";

const saleItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true 
  },
  name: { 
    type: String, required: true 
  },
  barcode: {
     type: String 
    },
  salePrice: { type: Number, required: true },
  quantity: { type: Number, required: true },
  total: { type: Number, required: true },
});

const saleSchema = new mongoose.Schema(
  {
    saleNumber: { 
      type: String, unique: true 
    },
    items: [saleItemSchema],
    subtotal: { 
      type: Number, required: true 
    },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["flat", "percent"], default: "flat" },
    tax: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "jazzcash", "easypaisa", "split"],
      default: "cash",
    },
    cashReceived: { type: Number, default: 0 },
    changeReturn: { type: Number, default: 0 },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["completed", "refunded"], default: "completed" },
  },
  { timestamps: true }
);

// Auto generate sale number
saleSchema.pre("save", async function () {
  if (!this.saleNumber) {
    const count = await mongoose.model("Sale").countDocuments();
    this.saleNumber = `SALE-${String(count + 1).padStart(5, "0")}`;
  }
});

export default mongoose.model("Sale", saleSchema);