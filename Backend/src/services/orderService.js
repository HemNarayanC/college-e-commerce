import Order from "../models/Order.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

const createOrder = async (userId, orderData) => {
  const { items, paymentMethod, shippingAddress } = orderData;

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

  let totalAmount = 0;
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

    let finalPrice,
      availableStock,
      updatedVariant = null;

    if (variant?.color) {
      // Find selected variant
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

      // Deduct stock and update
      matchedVariant.stock -= quantity;
      finalPrice = matchedVariant.price;
      availableStock = matchedVariant.stock;
      updatedVariant = matchedVariant;
    } else {
      // No variant selected — use base stock
      if (product.stock < quantity) {
        throw new Error(`Insufficient stock for "${product.name}"`);
      }

      product.stock -= quantity;
      finalPrice = product.price;
    }

    const itemTotal = finalPrice * quantity;
    totalAmount += itemTotal;

    orderItems.push({
      productId: product._id,
      vendorId: product.vendorId,
      quantity,
      price: finalPrice,
      variant: updatedVariant
        ? {
            color: updatedVariant.color,
            price: updatedVariant.price,
            stock: updatedVariant.stock,
          }
        : undefined,
    });

    // Commission and vendor payout
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
    totalAmount,
    paymentMethod,
    shippingAddress,
    items: orderItems,
    paymentSplit,
  });

  await order.save();
  return order;
};

const fetchVendorOrders = async (vendorId) => {
  const orders = await Order.find({ "items.vendorId": vendorId })
    .populate("items.productId", "name price")
    .populate("userId", "name email");

  return orders.map((order) => {
    const vendorItems = order.items.filter(
      (item) => item.vendorId.toString() === vendorId.toString()
    );
    const vendorSplit = order.paymentSplit.find(
      (split) => split.vendorId.toString() === vendorId.toString()
    );

    return {
      orderId: order._id,
      orderDate: order.orderDate,
      totalAmount: order.totalAmount,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      items: vendorItems,
      vendorPayout: vendorSplit?.amount || 0,
    };
  });
};

const updateOrderItemStatus = async (vendorId, orderId, productId, newStatus) => {
  const allowedStatuses = ["processing", "shipped", "delivered", "paid", "cancelled"];
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error("Invalid item status.");
  }

  // Fetch the order
  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  let itemFound = false;

  // Update itemStatus for matching vendorId & productId
  order.items = order.items.map(item => {
    if (
      item.vendorId.toString() === vendorId.toString() &&
      item.productId.toString() === productId.toString()
    ) {
      item.itemStatus = newStatus;
      itemFound = true;
    }
    return item;
  });

  if (!itemFound) {
    throw new Error("No matching item found for this vendor in the order.");
  }

  // Optional: After updating itemStatus, you may update overall order status:
  // e.g., if all items itemStatus === 'delivered', set order.status = 'delivered'
  const allDelivered = order.items.every(i => i.itemStatus === "delivered");
  const anyCancelled = order.items.some(i => i.itemStatus === "cancelled");
  if (allDelivered) {
    order.status = "delivered";
  } else if (anyCancelled && order.status !== "cancelled") {
    // If some item cancelled and you want to reflect overall cancellation:
    // Decide business logic: you might keep overall status separate
    order.status = "cancelled";
  }
  // keep overall status as is, or set to 'shipped' if all shipped, etc.
  const allShipped = order.items.every(i => ["shipped", "delivered"].includes(i.itemStatus));
  if (allShipped && !allDelivered) {
    order.status = "shipped";
  }

  await order.save();
  return order;
};

export default {
  createOrder,
  fetchVendorOrders,
  updateOrderItemStatus,
};
