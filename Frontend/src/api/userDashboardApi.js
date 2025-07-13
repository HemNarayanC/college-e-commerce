import axios from "axios";
import { config } from "../config/config";

const getUserOrderHistory = async (token) => {
  try {
    const orders = await axios.get(
      `${config.baseApiUrl}/users/orders/history`,
      {
        withCredentials: true,
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log(orders);
    return orders.data;
  } catch (error) {
    console.error("Failed to fetch vendor feedbacks:", error);
    throw error;
  }
};

const getUserDashboard = async (token) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/customer/dashboard/`, {
      withCredentials: true,
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user dashboard:", error);
    throw error;
  }
};

export { getUserOrderHistory, getUserDashboard };
