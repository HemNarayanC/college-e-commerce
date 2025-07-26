import mongoose, { Types } from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  orderDate: { type: Date, default: Date.now },
  totalAmount: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["pending", "paid", "shipped", "delivered", "cancelled", "processing", "out_for_delivery"],
    default: "pending",
  },
  paymentMethod: { type: String, required: true },
  shippingAddress: {
    line1: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  paymentSplit: [
    {
      vendorId: { type: Types.ObjectId, ref: "Vendor", required: true },
      amount: { type: Number, required: true },
      platformFee: { type: Number, min: 0 },
      productIds: [{ type: Types.ObjectId, ref: "Product" }],
    },
  ],
  items: [
    {
      productId: { type: Types.ObjectId, ref: "Product" },
      vendorId: { type: Types.ObjectId, ref: "Vendor" },
      quantity: { type: Number },
      price: { type: Number },
      variant: {
        color: { type: String },
        price: { type: Number },
        stock: { type: Number },
      },
       itemStatus: {
        type: String,
        enum: ["pending", "shipped", "delivered", "paid", "cancelled", "processing"],
        default: "pending",
      },
    },
  ],
});

export default mongoose.model("Order", OrderSchema);
