import mongoose, { Types } from "mongoose";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import Visit from "../../models/Visit.js";

const vendorIdMatch = (vendorId) => ({
  $match: { "paymentSplit.vendorId": new Types.ObjectId(vendorId) }
});

const getSalesSummary = async (vendorId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const lifetimeAgg = await Order.aggregate([
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    { $group: { _id: null, total: { $sum: "$paymentSplit.amount" } } }
  ]);

  const monthAgg = await Order.aggregate([
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    { $match: { orderDate: { $gte: startOfMonth } } },
    { $group: { _id: null, total: { $sum: "$paymentSplit.amount" } } }
  ]);

  return {
    lifetime: lifetimeAgg[0]?.total || 0,
    thisMonth: monthAgg[0]?.total || 0
  };
};

const getTopProducts = async (vendorId, limit = 5) => {
  const agg = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.vendorId": new Types.ObjectId(vendorId) } },
    { $group: { _id: "$items.productId", totalSold: { $sum: "$items.quantity" } } },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        image: { $arrayElemAt: ["$product.images", 0] },
        totalSold: 1
      }
    }
  ]);

  return agg;
};

const getLowStock = async (vendorId, threshold = 5) => {
  return await Product.find(
    { vendorId: new Types.ObjectId(vendorId), stock: { $lte: threshold } },
    "name stock images"
  );
};

const getOrderVolume = async (vendorId, weeks = 4) => {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000;
  const sinceDate = new Date(Date.now() - weeks * msPerWeek);

  const agg = await Order.aggregate([
    { $match: { orderDate: { $gte: sinceDate } } },
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    {
      $group: {
        _id: { $isoWeek: "$orderDate" },
        count: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  return agg.map(d => ({ week: d._id, orders: d.count }));
};

const getPayoutSummary = async (vendorId) => {
  const agg = await Order.aggregate([
    { $unwind: "$paymentSplit" },
    vendorIdMatch(vendorId),
    {
      $group: {
        _id: null,
        total: { $sum: "$paymentSplit.amount" }
      }
    }
  ]);

  return agg[0]?.total || 0;
};

const getTrafficAnalytics = async (vendorId, days = 7) => {
  const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const agg = await Visit.aggregate([
    {
      $match: {
        vendorId: new Types.ObjectId(vendorId),
        createdAt: { $gte: sinceDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
        },
        visits: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  return agg.map(d => ({ date: d._id, visits: d.visits }));
};

export default {
  getSalesSummary,
  getTopProducts,
  getLowStock,
  getOrderVolume,
  getPayoutSummary,
  getTrafficAnalytics
};