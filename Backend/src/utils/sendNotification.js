// utils/sendNotification.js

import Notification from "../models/Notification.js";

const notificationTemplates = {
  order_placed: {
    title: () => "New Order Received",
    message: ({ orderId }) => `Order #${orderId} includes your products.`,
    link: ({ orderId }) => `/vendor/orders/${orderId}`,
  },
  order_delivered: {
    title: () => "Order Delivered",
    message: ({ orderId }) =>
      `Order #${orderId} has been delivered successfully.`,
    link: ({ orderId }) => `/orders/${orderId}`,
  },
  support_reply: {
    title: () => "Support Reply",
    message: ({ ticketId }) =>
      `A reply has been added to your ticket #${ticketId}.`,
    link: ({ ticketId }) => `/support/${ticketId}`,
  },

  vendor_payout_released: {
    title: () => "Payout Released",
    message: ({ vendorId, amount }) =>
      `Payout of $${amount} has been released to vendor #${vendorId}.`,
    link: ({ vendorId }) => `/vendor/payouts/${vendorId}`,
  },
  // Add more types as needed
};

const sendNotification = async ({ userId, vendorId, type, data }) => {
  console.log("Sending notification:", {
    userId,
    vendorId,
    type,
    data,
  });
  const template = notificationTemplates[type];

  if (!template) throw new Error(`No notification template for type: ${type}`);

  const title = template.title();
  const message = template.message(data);
  const link = template.link(data);

  const notification = new Notification({
    userId,
    vendorId,
    title,
    message,
    type,
    link,
  });

  await notification.save();
};

export default sendNotification;
