import vendorDashboardService from "../../services/dashboard/vendorDashboardService.js";

const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const [
      sales,
      topProducts,
      lowStock,
      orderVolume,
      payout,
      traffic,
      orders,
      monthlyOrderCount,
      stats
    ] = await Promise.all([
      vendorDashboardService.getSalesSummary(vendorId),
      vendorDashboardService.getTopProducts(vendorId),
      vendorDashboardService.getLowStock(vendorId),
      vendorDashboardService.getOrderVolume(vendorId),
      vendorDashboardService.getPayoutSummary(vendorId),
      vendorDashboardService.getTrafficAnalytics(vendorId, 30),
      vendorDashboardService.getOrders(vendorId),
      vendorDashboardService.getMonthlyOrderCount(vendorId),
      vendorDashboardService.getPerformanceStats(vendorId)
    ]);

    res.json({
      sales,
      topProducts,
      lowStock,
      orderVolume,
      payout,
      traffic,
      orders,
      stats
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getVendorDashboard };
