import axios from "axios";
import { config } from "../config/config";

const getAdminDashboardData = async(token) => {
  const response = await axios.get(
    `${config.baseApiUrl}/admin/dashboard/`,
    {
      headers: {
        Authorization: `${token}`,
      },
      withCredentials: true,
    }
  );
  console.log("Response for Admin Dashboard", response)
  return response.data;
};

export { getAdminDashboardData };
