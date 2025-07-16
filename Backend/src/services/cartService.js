// src/services/cartService.js

import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";

const getCart = async (userId) => {
  const items = await CartItem
    .find({ userId })
    .populate("productId")
    .lean();

  return items.map(item => {
    const product = item.productId;
    const variant = product?.variants?.find(
      v => v._id.toString() === item.variantId?.toString()
    );

    return {
      cartId: item._id.toString(),
      ...item,
      product,
      variant,
    };
  });
};


const addToCart = async (userId, productId, variantId = null, quantity = 1) => {
  // try to find existing
  const filter = { userId, productId, variantId };
  const existing = await CartItem.findOne(filter);
  if (existing) {
    existing.quantity += quantity;
    await existing.save();
    return existing;
  }
  // else create new
  const created = await CartItem.create({ userId, productId, variantId, quantity });
  return created;
};

const updateCartItem = async (userId, productId, variantId = null, quantity) => {
  const filter = { userId, productId, variantId };
  // set quantity, but enforce min 1
  const updated = await CartItem.findOneAndUpdate(
    filter,
    { quantity: Math.max(1, quantity) },
    { new: true }
  );
  if (!updated) throw new Error("Cart item not found");
  return updated;
};

const removeFromCart = async (userId, cartId) => {
  await CartItem.deleteOne({ userId, cartId });
};

const clearCart = async (userId) => {
  await CartItem.deleteMany({ userId });
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
