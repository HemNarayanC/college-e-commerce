import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    token: { type: String, default: null },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Created", "Completed", "Failed", "COD"],
      default: "Created",
    },
    transactionIdx: { type: String, index: true, default: null },
    productIdentities: [{ type: String }],
    productNames: [{ type: String }],
    purchaseOrderId: { type: String },
    khaltiUser: {
      name: String,
      email: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
