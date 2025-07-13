import axios from "axios";
import { config } from "../config/config";

const getVendorOrders = async (token) => {
  const response = await axios.get(
    `${config.baseApiUrl}/orders/vendor/orders`,
    {
      headers: {
        Authorization: token,
      },
      withCredentials: true,
    }
  );
  console.log("Response for Vendor Orders", response.data);
  return response.data;
};

export { getVendorOrders };
