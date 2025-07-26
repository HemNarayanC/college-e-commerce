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
// Place an order API call
// orderData example: { items, paymentMethod, shippingAddress, khaltiToken (optional) }
const placeOrder = async (orderData, token) => {
  console.log("Order data for placed order", orderData)
  try {
    const response = await axios.post(
      `${config.baseApiUrl}/orders/place-order`,
      orderData,
      {
        headers: {
          Authorization: `${token}`, // pass auth token if required
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { message, order }
  } catch (error) {
    // Extract backend error message if available
    const errMsg =
      error.response?.data?.error || error.message || "Order failed";
    throw new Error(errMsg);
  }
};

const updateOrderStatus = async (orderData, token) => {
  console.log("Order Data", orderData)
  try {
    const response = await axios.patch(
      `${config.baseApiUrl}/orders/vendor/item/status`,
      orderData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { message, order }
  } catch (error) {
    // Extract backend error message if available
    const errMsg =
      error.response?.data?.error || error.message || "Order Status update failed";
    throw new Error(errMsg);
  }
};

const initiateKhalti = async (payload, token) => {
  console.log("Khati Products", payload)
  const response = await axios.post(
    `${config.baseApiUrl}/payments/initiate`,
    payload,
    {
      headers: {
        Authorization: `${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const verifyKhalti = async (paymentToken, amount, authToken) => {
  const response = await axios.get(
    `${config.baseApiUrl}/payments/verify?token=${paymentToken}&amount=${amount}`,
    {
      headers: {
        Authorization: authToken,
      },
    }
  );
  return response.data;
};

const confirmDelivery = async(orderData, token) => {
    console.log("Order Data", orderData)
  try {
    const response = await axios.post(
      `${config.baseApiUrl}/admin/confirmdelivery`,
      orderData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // { message, order }
  } catch (error) {
    // Extract backend error message if available
    const errMsg =
      error.response?.data?.error || error.message || "Order Status update failed";
    throw new Error(errMsg);
  }
}

export { getVendorOrders, placeOrder, initiateKhalti, verifyKhalti, updateOrderStatus, confirmDelivery };
