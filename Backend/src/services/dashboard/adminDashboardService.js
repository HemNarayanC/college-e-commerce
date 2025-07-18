import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import User from "../../models/User.js";
import Vendor from "../../models/Vendor.js";
import Category from "../../models/Category.js";
import Review from "../../models/Review.js";
import Payout from "../../models/Payout.js";

const fetchAdminDashboardData = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear(), 0, 0);

  const stats = {};
  let customers = [];
  let vendors = [];
  let orders = [];
  let products = [];
  let categories = [];
  let reviews = [];

  try {
    stats.totalOrders = await Order.countDocuments();

    const lifetimeSalesAgg = await Payout.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    stats.lifetimeSales = lifetimeSalesAgg[0]?.total || 0;

    const monthlySalesAgg = await Payout.aggregate([
      { $match: { status: "completed", payoutDate: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);
    stats.monthlySales = monthlySalesAgg[0]?.total || 0;

    stats.averageOrderValue = stats.totalOrders === 0 ? 0 : stats.lifetimeSales / stats.totalOrders;

    const prevMonthSalesAgg = await Payout.aggregate([
      { $match: { status: "completed", payoutDate: { $gte: startOfPrevMonth, $lte: endOfPrevMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } },
    ]);

    const prevMonthAOV =
      prevMonthSalesAgg[0]?.count === 0 ? 0 : prevMonthSalesAgg[0]?.total / prevMonthSalesAgg[0]?.count;

    stats.prevMonthAOV = prevMonthAOV;
    stats.monthlyAOV = monthlySalesAgg[0]?.count === 0 ? 0 : stats.monthlySales / monthlySalesAgg[0]?.count;

    stats.aovGrowth =
      prevMonthAOV === 0 ? 0 : ((stats.monthlyAOV - prevMonthAOV) / prevMonthAOV) * 100;

    const thisYearAgg = await Payout.aggregate([
      { $match: { status: "completed", payoutDate: { $gte: startOfYear } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const lastYearAgg = await Payout.aggregate([
      { $match: { status: "completed", payoutDate: { $gte: startOfLastYear, $lte: endOfLastYear } } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    stats.thisYear = thisYearAgg[0]?.total || 0;
    stats.lastYear = lastYearAgg[0]?.total || 0;
    stats.percentChangeYear =
      stats.lastYear === 0 ? 0 : ((stats.thisYear - stats.lastYear) / stats.lastYear) * 100;

    const currentMonthCustomersWithOrders = await Order.distinct("userId", {
      orderDate: { $gte: startOfMonth },
    });

    const previousMonthCustomersWithOrders = await Order.distinct("userId", {
      orderDate: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });

    const retainedCustomers = previousMonthCustomersWithOrders.filter((userId) =>
      currentMonthCustomersWithOrders.includes(userId.toString())
    );

    stats.customerRetentionRate =
      previousMonthCustomersWithOrders.length === 0
        ? 0
        : (retainedCustomers.length / previousMonthCustomersWithOrders.length) * 100;

    const totalCustomers = await User.countDocuments({ role: "customer" });
    const currentMonthCustomers = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: startOfMonth },
    });
    const previousMonthCustomers = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });
    stats.totalCustomers = totalCustomers;
    stats.customersPercentageChange =
      previousMonthCustomers === 0
        ? 0
        : ((currentMonthCustomers - previousMonthCustomers) / previousMonthCustomers) * 100;

    stats.activeCustomers = await User.countDocuments({ role: "customer", isActive: true });

    const totalVendors = await Vendor.countDocuments();
    const currentMonthVendors = await Vendor.countDocuments({ createdAt: { $gte: startOfMonth } });
    const previousMonthVendors = await Vendor.countDocuments({
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });
    stats.totalVendors = totalVendors;
    stats.vendorsPercentageChange =
      previousMonthVendors === 0
        ? 0
        : ((currentMonthVendors - previousMonthVendors) / previousMonthVendors) * 100;

    stats.activeVendors = await Vendor.countDocuments({ status: "approved" });
    const currentMonthActiveVendors = await Vendor.countDocuments({
      status: "approved",
      createdAt: { $gte: startOfMonth },
    });
    const previousMonthActiveVendors = await Vendor.countDocuments({
      status: "approved",
      createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth },
    });
    stats.activeVendorsPercentageChange =
      previousMonthActiveVendors === 0
        ? 0
        : ((currentMonthActiveVendors - previousMonthActiveVendors) / previousMonthActiveVendors) * 100;

    stats.pendingVendors = await Vendor.countDocuments({ status: "pending" });
    stats.totalProducts = await Product.countDocuments();
    stats.lowStockProducts = await Product.countDocuments({ stock: { $lt: 5 } });
    stats.totalCategories = await Category.countDocuments();
    stats.activeCategories = await Category.countDocuments({ isActive: true });
    stats.inactiveCategories = await Category.countDocuments({ isActive: false });
    stats.totalReviews = await Review.countDocuments();
    stats.flaggedReviews = await Review.countDocuments({ flags: { $exists: true, $not: { $size: 0 } } });

    const platformEarningsAgg = await Order.aggregate([
      { $unwind: "$paymentSplit" },
      { $group: { _id: null, total: { $sum: "$paymentSplit.platformFee" } } },
    ]);
    stats.platformEarnings = platformEarningsAgg[0]?.total || 0;

    const vendorEarningsAgg = await Payout.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    stats.vendorEarnings = vendorEarningsAgg[0]?.total || 0;

    customers = await User.aggregate([
      { $match: { role: "customer" } },
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          role: 1,
          createdAt: 1,
          isActive: 1,
          totalOrders: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
        },
      },
    ]);

    vendors = await Vendor.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "vendorId",
          as: "productList",
        },
      },
      {
        $addFields: {
          totalProducts: { $size: "$productList" },
        },
      },
      {
        $lookup: {
          from: "orders",
          let: { vendorId: "$_id" },
          pipeline: [
            { $unwind: "$items" },
            {
              $match: {
                $expr: { $eq: ["$items.vendorId", "$$vendorId"] },
              },
            },
            {
              $group: {
                _id: null,
                totalSold: { $sum: "$items.quantity" },
              },
            },
          ],
          as: "salesQtyData",
        },
      },
      {
        $addFields: {
          totalSold: {
            $ifNull: [{ $arrayElemAt: ["$salesQtyData.totalSold", 0] }, 0],
          },
        },
      },
      {
        $lookup: {
          from: "payouts",
          let: { vendorId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$vendorId", "$$vendorId"] },
                status: "completed",
              },
            },
            {
              $group: {
                _id: "$vendorId",
                totalSales: { $sum: "$amount" },
              },
            },
          ],
          as: "salesData",
        },
      },
      {
        $addFields: {
          totalSales: {
            $ifNull: [{ $arrayElemAt: ["$salesData.totalSales", 0] }, 0],
          },
        },
      },
      {
        $project: {
          businessName: 1,
          email: 1,
          phone: 1,
          status: 1,
          commissionRate: 1,
          createdAt: 1,
          totalProducts: 1,
          totalSold: 1,
          totalSales: 1,
        },
      },
    ]);

    orders = await Order.find()
      .sort({ orderDate: -1 })
      .limit(50)
      .populate("userId", "name email")
      .populate("items.productId", "name price");

    products = await Product.find()
      .populate("vendorId", "businessName")
      .populate("categoryId", "name");

    categories = await Category.find();

    reviews = await Review.find()
      .populate("userId", "name")
      .populate("productId", "name");
  } catch (err) {
    console.error("Dashboard fetch failed:", err);
  }

  return {
    stats,
    customers,
    vendors,
    orders,
    products,
    categories,
    reviews,
  };
};

export default {
  fetchAdminDashboardData,
};
