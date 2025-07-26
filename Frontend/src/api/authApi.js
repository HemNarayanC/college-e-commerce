import axios from "axios";
import { config } from "../config/config";

const register = async (userData) => {
  const response = await axios.post(
    `${config.baseApiUrl}/auth/register`,
    userData
  );

  return response;
};

const login = async (data) => {
console.log("Logging in with data:", data);
  const response = await axios.post(`${config.baseApiUrl}/auth/login`, {
    email: data.email,
    password: data.password,
  });

  return response;
};

const logout = async () => {
  const response = await axios.post(`${config.baseApiUrl}/auth/logout`);
  return response;
};

const updateVendorStatus = async (vendorId, status, token) => {
  try {
    const response = await axios.put(
      `${config.baseApiUrl}/admin/vendors/${vendorId}/status`,
      { status },
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // { message: "Vendor status updated to ..." }
  } catch (error) {
    console.error("Error updating vendor status:", error.response?.data || error.message);
    throw error;
  }
};
const toggleCustomerStatus = async (customerId, isActive, token) => {
  try {
    const response = await axios.patch(
      `${config.baseApiUrl}/admin/customers/${customerId}/status`,
      { isActive },
      {
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating customer status:", error.response?.data || error.message);
    throw error;
  }
};


export { register, login, logout, updateVendorStatus, toggleCustomerStatus };
