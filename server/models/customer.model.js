import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  type:        { type: String, enum: ["sale", "payment", "credit"], required: true },
  amount:      { type: Number, required: true },
  description: { type: String, default: "" },
  saleRef:     { type: mongoose.Schema.Types.ObjectId, ref: "Sale" },
  date:        { type: Date, default: Date.now },
});

const customerSchema = new mongoose.Schema(
  {
    name:    { type: String, required: true, trim: true },
    phone:   { type: String, trim: true, default: "" },
    email:   { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    cnic:    { type: String, trim: true, default: "" },
    balance: { type: Number, default: 0 }, // positive = customer owes us (udhaar)
    transactions: [transactionSchema],
    status:  { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Customer", customerSchema);