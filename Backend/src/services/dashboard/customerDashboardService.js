import User from "../../models/User.js";
import Order from "../../models/Order.js";
import Wishlist from "../../models/Wishlist.js";
import Notification from "../../models/Notification.js";
import Review from "../../models/Review.js";

const getDashboardData = async (userId) => {
  const [profile, orders, wishlist, notifications, reviews] = await Promise.all([
    User.findById(userId).select("-passwordHash").lean(),
    Order.find({ userId }).sort({ orderDate: -1 }).populate("items.productId", "name images").limit(5).lean(),
    Wishlist.findOne({ userId }).populate("products").lean(),
    Notification.find({ userId }).sort({ createdAt: -1 }).limit(10).lean(),
    Review.find({ userId }).populate("productId", "name images").sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  if (!profile) {
    throw new Error("User not found");
  }

  return {
    profile,
    orders,
    wishlist: wishlist?.products || [],
    notifications,
    reviews,
  };
};

export default { getDashboardData };
