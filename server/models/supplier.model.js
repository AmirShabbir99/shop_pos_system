import mongoose from "mongoose";

const payableSchema = new mongoose.Schema({
  type:        { type: String, enum: ["purchase", "payment"], required: true },
  amount:      { type: Number, required: true },
  description: { type: String, default: "" },
  date:        { type: Date, default: Date.now },
});

const supplierSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    phone:       { type: String, trim: true, default: "" },
    email:       { type: String, trim: true, default: "" },
    address:     { type: String, trim: true, default: "" },
    company:     { type: String, trim: true, default: "" },
    balance:     { type: Number, default: 0 }, 
    transactions: [payableSchema],
    status:      { type: String, enum: ["active", "inactive"], default: "active" },
    createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.model("Supplier", supplierSchema);