import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  userId:    { type: mongoose.Types.ObjectId, ref: "User",   required: true },
  productId: { type: mongoose.Types.ObjectId, ref: "Product",required: true },
  variantId: { type: mongoose.Types.ObjectId, default: null },
  quantity:  { type: Number, default: 1, min: 1 }
});

export default mongoose.model("CartItem", CartItemSchema);