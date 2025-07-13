import axios from "axios";
import { config } from "../config/config";

const getReviewsByProductId = async(productId) => {
    try {
    const response = await axios.get(`${config.baseApiUrl}/products/review/${productId}/`);
    console.log("Reviews of Products",response.data.reviews)
    return response.data;
  } catch (error) {
    console.error("Error fetching products' reviews", error);
  }
}

export {getReviewsByProductId}