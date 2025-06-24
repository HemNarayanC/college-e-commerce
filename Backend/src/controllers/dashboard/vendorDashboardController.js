import vendorDashboardService from "../../services/dashboard/vendorDashboardService.js";

export const getDashboard = async (req, res) => {
  try {
    const vendorId = req.user.vendorId;

    const [
      sales,
      topProducts,
      lowStock,
      orderVolume,
      payout,
      traffic
    ] = await Promise.all([
      vendorDashboardService.getSalesSummary(vendorId),
      vendorDashboardService.getTopProducts(vendorId),
      vendorDashboardService.getLowStock(vendorId),
      vendorDashboardService.getOrderVolume(vendorId),
      vendorDashboardService.getPayoutSummary(vendorId),
      vendorDashboardService.getTrafficAnalytics(vendorId),
    ]);

    res.json({
      sales,
      topProducts,
      lowStock,
      orderVolume,
      payout,
      traffic
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
