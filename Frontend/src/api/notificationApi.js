import axios from "axios";
import { config } from "../config/config";

const getCustomerNotifications = async (token) => {
  console.log("User token", token)
  const response = await axios.get(`${config.baseApiUrl}/notifications/customer`, {
    headers: {
      Authorization: token,
    },
    withCredentials: true,
  });
  console.log("Customer Notifications:", response.data);
  return response.data;
};

const getVendorNotifications = async (token) => {
  console.log("Vendor token", token)

  const response = await axios.get(`${config.baseApiUrl}/notifications/vendor`, {
    headers: {
      Authorization: token,
    },
    withCredentials: true,
  });
  console.log("Vendor Notifications:", response.data);
  return response.data;
};

const markNotificationAsRead = async (notificationId, token) => {
  const response = await axios.patch(
    `${config.baseApiUrl}/notifications/${notificationId}/read`,
    {},
    {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    }
  );
  console.log("Notification Marked As Read:", response.data);
  return response.data;
};

export {
  getCustomerNotifications,
  getVendorNotifications,
  markNotificationAsRead,
};
