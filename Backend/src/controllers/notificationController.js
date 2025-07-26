// controllers/notificationController.js
import notificationService from "../services/notificationService.js";

const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("User Id", userId)
    const notifications = await notificationService.getUserNotifications(
      userId
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getVendorNotifications = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;
    console.log("VendorId ==> ",vendorId)
    const notifications = await notificationService.getVendorNotifications(
      vendorId
    );
    console.log(notifications)
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const currentUser = req.user; // from auth middleware

    const updated = await notificationService.markAsRead(
      notificationId,
      currentUser
    );

    if (!updated) {
      return res
        .status(403)
        .json({ error: "Access denied: Not your notification." });
    }

    res.json({ message: "Notification marked as read", notification: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export { getUserNotifications, getVendorNotifications, markNotificationAsRead };
