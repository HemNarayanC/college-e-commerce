import axios from "axios";
import { config } from "../config/config";

const getAllProducts = async (params = {}) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/products`, {
      params,
    });
    console.log("Products fetched successfully:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getProductsByVendor = async (vendorId) => {
  try {
    const response = await axios.get(
      `${config.baseApiUrl}/products/vendor/${vendorId}/products`
    );
    console.log("Products of Vendor", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vendor products", error);
  }
};

const getProductById = async (productId) => {
  try {
    const response = await axios.get(
      `${config.baseApiUrl}/products/${productId}`
    );
    // console.log("Products of Vendor", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

export { getAllProducts, getProductsByVendor, getProductById };
