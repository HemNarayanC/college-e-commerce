import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import notificationService from "./notificationService.js";
import Payout from "../models/Payout.js";
import User from "../models/User.js";

const createOrder = async (userId, orderData) => {
  const { items, paymentMethod, shippingAddress, totalAmount } = orderData;

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order must include at least one item.");
  }

  if (
    !paymentMethod ||
    !shippingAddress?.line1 ||
    !shippingAddress?.city ||
    !shippingAddress?.zip
  ) {
    throw new Error("Valid shipping address and payment method are required.");
  }

  let computedTotalAmount = 0;
  const orderItems = [];
  const paymentSplitMap = new Map();

  for (const item of items) {
    const { productId, quantity, variant } = item;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      throw new Error(`Invalid product ID: ${productId}`);
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product not found for ID: ${productId}`);
    }

    let finalPrice;
    let updatedVariant = null;

    // Variant case
    if (variant?.color) {
      const matchedVariant = product.variants.find(
        (v) => v.color === variant.color
      );

      if (!matchedVariant) {
        throw new Error(
          `Variant "${variant.color}" not available for product: ${product.name}`
        );
      }

      if (matchedVariant.stock < quantity) {
        throw new Error(
          `Insufficient stock for "${product.name}" (${variant.color})`
        );
      }

      if (product.stock < quantity) {
        throw new Error(`Insufficient total stock for "${product.name}"`);
      }

      // Deduct both variant and total stock
      matchedVariant.stock -= quantity;
      product.stock -= quantity;
      product.markModified("variants");

      finalPrice =
        typeof matchedVariant.price === "number"
          ? matchedVariant.price
          : product.price;

      updatedVariant = {
        color: matchedVariant.color,
        price: matchedVariant.price ?? product.price,
        stock: matchedVariant.stock,
      };
    } else {
      // Base product case
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for "${product.name}"`);
      }

      // Deduct only total stock
      product.stock -= quantity;
      finalPrice = product.price;
    }

    const itemTotal = finalPrice * quantity;
    computedTotalAmount += itemTotal;

    orderItems.push({
      productId: product._id,
      vendorId: product.vendorId,
      quantity,
      price: finalPrice,
      variant: updatedVariant || undefined,
    });

    // Commission & Vendor payout
    const platformFee = product.commissionRate
      ? product.commissionRate * itemTotal
      : 0;
    const vendorAmount = itemTotal - platformFee;

    const vendorKey = product.vendorId.toString();
    if (!paymentSplitMap.has(vendorKey)) {
      paymentSplitMap.set(vendorKey, {
        amount: 0,
        platformFee: 0,
        productIds: [],
      });
    }

    const split = paymentSplitMap.get(vendorKey);
    split.amount += vendorAmount;
    split.platformFee += platformFee;
    split.productIds.push(product._id);

    await product.save();
  }

  // Check if totalAmount from client matches computed total to avoid tampering
  if (totalAmount && Math.abs(totalAmount - computedTotalAmount) > 0.01) {
    throw new Error("Total amount mismatch.");
  }

  const paymentSplit = Array.from(paymentSplitMap.entries()).map(
    ([vendorId, data]) => ({
      vendorId,
      amount: data.amount,
      platformFee: data.platformFee,
      productIds: data.productIds,
    })
  );

  const order = new Order({
    userId,
    totalAmount: computedTotalAmount,
    paymentMethod,
    shippingAddress,
    items: orderItems,
    paymentSplit,
    status: paymentMethod === "cod" ? "pending" : "paid", // For Khalti, mark paid after verification in controller
  });

  await order.save();

  await notificationService.dispatchNotificationByType("order_placed", order);

  return order;
};

const fetchVendorOrders = async (vendorId) => {
  const orders = await Order.find({ "items.vendorId": vendorId })
    .sort({ orderDate: -1 })
    .populate("items.productId", "name price")
    .populate("userId", "name email");

  const productSalesMap = {};

  return orders.map((order) => {
    const vendorItems = order.items
      .filter((item) => item.vendorId.toString() === vendorId.toString())
      .map((item) => {
        const productId = item.productId?._id?.toString();
        if (productId) {
          if (!productSalesMap[productId]) {
            productSalesMap[productId] = 0;
          }
          productSalesMap[productId] += item.quantity;
        }

        return {
          ...item.toObject(),
          totalSold: productSalesMap[productId] || 0,
        };
      });

    // ✅ Calculate subtotal only for this vendor's items
    const vendorTotal = vendorItems.reduce((acc, item) => {
      const price = item.productId?.price || 0;
      return acc + price * item.quantity;
    }, 0);

    const vendorSplit = order.paymentSplit.find(
      (split) => split.vendorId.toString() === vendorId.toString()
    );

    return {
      orderId: order._id,
      orderDate: order.orderDate,
      totalAmount: vendorTotal, // ✅ Only this vendor's product total
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      items: vendorItems,
      vendorPayout: vendorSplit?.amount || 0,
      user: order.userId,
    };
  });
};


export default {
  createOrder,
  fetchVendorOrders,
  updateOrderItemStatus,
  getUserOrders,
  confirmDeliveryAndReleasePayout,
};
