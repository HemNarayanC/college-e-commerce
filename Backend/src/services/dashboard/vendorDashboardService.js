import mongoose, { Types } from "mongoose";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Visit from "../../models/Visit.js";
import Payout from "../../models/Payout.js";

const vendorIdMatch = (vendorId) => ({
  $match: { "paymentSplit.vendorId": new Types.ObjectId(vendorId) },
});

const getSalesSummary = async (vendorId) => {
  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfThisYear = new Date(now.getFullYear(), 0, 1);
  const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
  const endOfLastYear = new Date(now.getFullYear(), 0, 0);
  const vendorObjectId = new Types.ObjectId(vendorId);

  const getTotal = async (match = {}) => {
    const agg = await Payout.aggregate([
      { $match: { vendorId: vendorObjectId, ...match } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    return agg[0]?.total || 0;
  };

  const lifetime = await getTotal();
  const thisMonth = await getTotal({
    payoutDate: { $gte: startOfThisMonth },
    status: "completed",
  });
  const lastMonth = await getTotal({
    payoutDate: { $gte: startOfLastMonth, $lte: endOfLastMonth },
    status: "completed",
  });
  const thisYear = await getTotal({
    payoutDate: { $gte: startOfThisYear },
    status: "completed",
  });
  const lastYear = await getTotal({
    payoutDate: { $gte: startOfLastYear, $lte: endOfLastYear },
    status: "completed",
  });

  const percentChangeMonth = lastMonth === 0 ? 0 : ((thisMonth - lastMonth) / lastMonth) * 100;
  const percentChangeYear = lastYear === 0 ? 0 : ((thisYear - lastYear) / lastYear) * 100;

  return {
    lifetime,
    thisMonth,
    lastMonth,
    percentChangeMonth,
    thisYear,
    lastYear,
    percentChangeYear,
  };
};

const getTopProducts = async (vendorId, limit = 5) => {
  const agg = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.vendorId": new Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: "$items.productId",
        totalSold: { $sum: "$items.quantity" },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        image: { $arrayElemAt: ["$product.images", 0] },
        totalSold: 1,
      },
    },
  ]);
  return agg;
};

const getLowStock = async (vendorId, threshold = 5) => {
  return await Product.find(
    {
      vendorId: new Types.ObjectId(vendorId),
      stock: { $lte: threshold },
    },
    "name stock images"
  );
};

const getOrderVolume = async (vendorId, weeks = 4) => {
  const sinceDate = new Date(Date.now() - weeks * 7 * 24 * 60 * 60 * 1000);
  const agg = await Order.aggregate([
    { $match: { orderDate: { $gte: sinceDate } } },
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    {
      $group: {
        _id: { $isoWeek: "$orderDate" },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return agg.map((d) => ({
    week: d._id,
    orders: d.count,
  }));
};

const getPayoutSummary = async (vendorId) => {
  const agg = await Payout.aggregate([
    {
      $match: {
        vendorId: new Types.ObjectId(vendorId),
        status: "completed",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$amount" },
      },
    },
  ]);
  return agg[0]?.total || 0;
};

const getTrafficAnalytics = async (vendorId, days = 7) => {
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const agg = await Visit.aggregate([
    {
      $match: {
        vendorId: new Types.ObjectId(vendorId),
        createdAt: { $gte: sinceDate },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        visits: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);
  return agg.map((d) => ({
    date: d._id,
    visits: d.visits,
  }));
};

const getOrders = async (vendorId) => {
  return await Order.find({ "paymentSplit.vendorId": vendorId });
};

const getMonthlyOrderCount = async (vendorId) => {
  const startOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const agg = await Order.aggregate([
    { $match: { orderDate: { $gte: startOfThisMonth } } },
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    { $count: "count" },
  ]);
  return agg[0]?.count || 0;
};

const getPerformanceStats = async (vendorId) => {
  const vendorObjectId = new Types.ObjectId(vendorId);

  const viewsAgg = await Visit.aggregate([
    { $match: { vendorId: vendorObjectId } },
    { $group: { _id: null, totalViews: { $sum: 1 } } },
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

  const ordersAgg = await Order.aggregate([
    { $unwind: "$paymentSplit" },
    { $match: { "paymentSplit.vendorId": vendorObjectId } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$paymentSplit.amount" },
        totalOrders: { $sum: 1 },
      },
    },
  ]);
  const totalOrders = ordersAgg[0]?.totalOrders || 0;
  const totalRevenue = ordersAgg[0]?.totalRevenue || 0;

  const conversionRate = totalViews === 0 ? "0" : `${((totalOrders / totalViews) * 100).toFixed(1)}`;
  const avgOrderValue = totalOrders === 0 ? "Rs. 0.00" : `${(totalRevenue / totalOrders).toFixed(2)}`;

  return {
    totalViews,
    conversionRate,
    avgOrderValue,
  };
};

export default {
  getSalesSummary,
  getTopProducts,
  getLowStock,
  getOrderVolume,
  getPayoutSummary,
  getTrafficAnalytics,
  getOrders,
  getMonthlyOrderCount,
  getPerformanceStats,
};
