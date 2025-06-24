import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  productId: { type: Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 }
});

export default mongoose.model("CartItem", CartItemSchema);