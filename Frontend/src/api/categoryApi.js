import axios from "axios";
import { config } from "../config/config";

const getCategories = async () => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/products/getCategory`);
    console.log("Categories fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

export {getCategories}