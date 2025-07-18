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
      totalAmount: vendorTotal,
      status: order.status,
      paymentMethod: order.paymentMethod,
      shippingAddress: order.shippingAddress,
      items: vendorItems,
      vendorPayout: vendorSplit?.amount || 0,
      user: order.userId,
    };
  });
};

const updateOrderItemStatus = async (
  vendorId,
  orderId,
  productId,
  newStatus
) => {
  const allowedStatuses = ["processing", "shipped", "delivered", "cancelled"];
  if (!allowedStatuses.includes(newStatus.toLowerCase().trim())) {
    throw new Error("Invalid item status.");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");
  console.log("items are ", order.items);

  let itemFound = false;

  // Normalize the newStatus string
  const normalizedStatus = newStatus.toLowerCase().trim();

  // Update only the matching item
  order.items = order.items.map((item) => {
    if (
      item.vendorId.toString() === vendorId.toString() &&
      item.productId.toString() === productId.toString()
    ) {
      item.itemStatus = normalizedStatus;
      itemFound = true;
    }
    return item;
  });

  if (!itemFound) {
    throw new Error("Item not found for vendor and product");
  }

  // Debug log actual statuses
  console.log("Updated item statuses:");
  order.items.forEach((item, idx) =>
    console.log(`Item ${idx}: status=${item.itemStatus}`)
  );

  // Determine overall order status based on item statuses
  // Filter items that belong to this vendor only
  const vendorItems = order.items.filter(
    (item) => item.vendorId.toString() === vendorId.toString()
  );

  // Recalculate overall order status based on only vendor's items
  const allDelivered = vendorItems.every(
    (i) => (i.itemStatus || "").toLowerCase() === "delivered"
  );
  const allCancelled = vendorItems.every(
    (i) => (i.itemStatus || "").toLowerCase() === "cancelled"
  );
  const allShippedOrDelivered = vendorItems.every((i) =>
    ["shipped", "delivered"].includes((i.itemStatus || "").toLowerCase())
  );

  if (allDelivered) {
    order.status = "delivered";
  } else if (allCancelled) {
    order.status = "cancelled";
  } else if (allShippedOrDelivered) {
    order.status = "shipped";
  } else {
    order.status = "processing";
  }

  await order.save();
  return order;
};

const getUserOrders = async (userId) => {
  const orders = await Order.find({ userId })
    .sort({ orderDate: -1 })
    .populate("items.productId", "name images");
  return orders;
};

const confirmDeliveryAndReleasePayout = async (
  orderId,
  productId,
  vendorId
) => {
  if (!orderId || !productId || !vendorId) {
    throw new Error("orderId, productId and vendorId are required");
  }

  const order = await Order.findById(orderId);
  if (!order) throw new Error("Order not found");

  const item = order.items.find(
    (i) =>
      i.productId.toString() === productId &&
      i.vendorId.toString() === vendorId
  );

  if (!item) throw new Error("Order item not found for vendor and product");
  if (item.itemStatus === "delivered") {
    throw new Error("Item already marked as delivered");
  }
  item.itemStatus = "delivered";

  const allVendorItemsDelivered = order.items
    .filter((i) => i.vendorId.toString() === vendorId)
    .every((i) => i.itemStatus === "delivered");

  if (allVendorItemsDelivered) {
    const split = order.paymentSplit.find(
      (p) => p.vendorId.toString() === vendorId
    );
    if (!split) throw new Error("Payment split info not found for vendor");
    const existingPayout = await Payout.findOne({
      vendorId,
      referenceId: orderId,
    });

    if (!existingPayout) {
      const payout = new Payout({
        vendorId,
        amount: split.amount,
        payoutDate: new Date(),
        status: "completed",
        referenceId: orderId,
      });

      await payout.save();

      // Notify vendor
      await notificationService.dispatchNotificationByType(
        "vendor_payout_released",
        {
          vendorId,
          orderId,
          amount: split.amount,
        }
      );
    }
  }

  await order.save();
    const allItemsDelivered = order.items.every(
    (i) => i.itemStatus === "delivered"
  );

  if (allItemsDelivered) {
    order.status = "delivered";
    await order.save();

    const customer = await User.findById(order.userId);
    if (customer) {
      await notificationService.dispatchNotificationByType("order_delivered", {
        _id: order._id,
        userId: customer._id,
        paymentSplit: order.paymentSplit,
      });
    }
  }

  return order;
};

export default {
  createOrder,
  fetchVendorOrders,
  updateOrderItemStatus,
  getUserOrders,
  confirmDeliveryAndReleasePayout,
};
