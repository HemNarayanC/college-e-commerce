import adminDashboardService from "../../services/dashboard/adminDashboardService.js";

const getAdminDashboardData = async (req, res) => {
  try {
    const data = await adminDashboardService.fetchAdminDashboardData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default getAdminDashboardData