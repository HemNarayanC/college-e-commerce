import axios from "axios";
import { config } from "../config/config";

const getVendorDashboardData = async (token) => {
  console.log("Response for vendor dashboard", token)
  const response = await axios.get(
    `${config.baseApiUrl}/vendor/dashboard`,
    {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    }
  );
  console.log("Response for Vendor Dashboard", response)
  return response.data;
};

export {getVendorDashboardData}