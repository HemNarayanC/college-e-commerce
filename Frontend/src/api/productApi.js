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
    console.log("Product Details for Checkout", response.data);
    // console.log("Products of Vendor", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching product", error);
  }
};

const addProduct = async (formData, token) => {
  try {
    const response = await axios.post(
      `${config.baseApiUrl}/products/addProduct`,
      formData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response for adding product", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in adding the product", error);
  }
};

const updateProduct = async (productId, formData, token) => {
  try {
    const response = await axios.put(
      `${config.baseApiUrl}/products/${productId}`,
      formData,
      {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Response for adding product", response.data);
    return response.data;
  } catch (error) {
    console.log("Error in adding the product", error);
  }
};

const deleteProduct = async (productId, token) => {
  try {
    const response = await axios.delete(
      `${config.baseApiUrl}/products/${productId}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    console.log("Response for deleting product", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting the product", error.response?.data || error.message);
    throw error;
  }
};

const toggleProductStatus = async (productId, status, token) => {
  try {
    const response = await axios.patch(
      `${config.baseApiUrl}/products/${productId}/status`,
      { status },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling product status:", error.response?.data || error.message);
    throw error;
  }
};


export { getAllProducts, getProductsByVendor, getProductById, addProduct, updateProduct, deleteProduct, toggleProductStatus };
