import axios from "axios";
import { config } from "../config/config";

const getFeaturedVendors = async () => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/vendors/featured`);
    console.log("Vendors fetched successfully:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};

const getVendors = async () => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/vendors/`);
    console.log("Vendors fetched successfully:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendors:", error);
    throw error;
  }
};

const registerVendor = async (formData, token) => {
  try {
    const response = await axios.post(
      `${config.baseApiUrl}/vendors/register`,
      formData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering vendor:", error);
    throw error;
  }
};

const vendorLogin = async ({ email, password }) => {
  const response = await axios.post(`${config.baseApiUrl}/vendors/login`, {
    email,
    password,
  },
    {
      withCredentials: true,
    });

  return response.data;
};

const getVendorFeedbacks = async (vendorId) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/vendors/${vendorId}/feedbacks`);
    console.log("Reviews",response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vendor feedbacks:", error);
    throw error;
  }
};

const getVendorById = async (vendorId) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/vendors/${vendorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor by ID:", error?.response?.data || error.message);
    throw error;
  }
};

export { getFeaturedVendors, getVendors, registerVendor, vendorLogin, getVendorFeedbacks, getVendorById };
