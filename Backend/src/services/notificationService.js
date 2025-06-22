import sendNotification from "../utils/sendNotification.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

const dispatchNotificationByType = async (type, order) => {
  const { _id: orderId, userId, paymentSplit } = order;

  const data = { orderId };

  if (type === "order_placed") {
    for (const split of paymentSplit) {
      await sendNotification({
        vendorId: split.vendorId,
        type,
        data,
      });
    }
  }

  if (type === "order_delivered") {
    await sendNotification({ userId, type, data });

    for (const split of paymentSplit) {
      await sendNotification({
        vendorId: split.vendorId,
        type,
        data,
      });
    }
  }

  // Extendable for more types
};

const getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

const getVendorNotifications = async (vendorId) => {
  return await Notification.find({ vendorId }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(
    notificationId,
    { isRead: true },
    { new: true }
  );
};

export default {
  dispatchNotificationByType,
  getUserNotifications,
  getVendorNotifications,
  markAsRead,
};
