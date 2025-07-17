import sendNotification from "../utils/sendNotification.js";
import Order from "../models/Order.js";
import Notification from "../models/Notification.js";

const dispatchNotificationByType = async (type, payload) => {
  console.log(type, payload);
  const { _id: orderId, userId, paymentSplit } = payload;

  const data = { orderId };

  if (type === "order_placed") {
    for (const split of paymentSplit) {
      console.log("Data: ", data);
      await sendNotification({
        vendorId: split.vendorId,
        type,
        data,
      });
    }
  }

  if (type === "order_delivered") {
    await sendNotification({ userId, type, data });

    // for (const split of paymentSplit) {
    //   await sendNotification({
    //     vendorId: split.vendorId,
    //     type,
    //     data,
    //   });
    // }
  }

  if (type === "vendor_payout_released") {
    const { vendorId, orderId, amount } = payload;
    const data = { orderId, amount, vendorId };
    console.log("Data for payout: ", data);

    await sendNotification({
      vendorId,
      type,
      data,
    });
  }
  // Extendable for more types
};

const getUserNotifications = async (userId) => {
  console.log("User Id from user notification service", userId);
  return await Notification.find({ userId, isRead: false }).sort({ createdAt: -1 });
};

const getVendorNotifications = async (vendorId) => {
  console.log("Vendor Id from vendor notification service", vendorId);
  return await Notification.find({ vendorId, isRead: false }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId, currentUser) => {
  const notification = await Notification.findById(notificationId);
  if (!notification) return null;

  const isUserMatch =
    notification.userId && notification.userId.toString() === currentUser.id;
  const isVendorMatch =
    notification.vendorId &&
    notification.vendorId.toString() === currentUser.vendorId;

  if (!isUserMatch && !isVendorMatch) {
    return null; // Not authorized
  }

  notification.isRead = true;
  return await notification.save();
};

export default {
  dispatchNotificationByType,
  getUserNotifications,
  getVendorNotifications,
  markAsRead,
};
