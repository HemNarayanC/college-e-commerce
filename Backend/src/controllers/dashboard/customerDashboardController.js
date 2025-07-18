import customerDashboardService from "../../services/dashboard/customerDashboardService.js";

const getDashboard = async (req, res) => {
  try {
    const userId = req.user.userId;
    const data = await customerDashboardService.getDashboardData(userId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { getDashboard };
