import axios from "axios";
import { config } from "../config/config";

const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/users/profile`, {
      withCredentials: true,
      headers: {
        Authorization: `${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile", error.response?.data || error.message);
    throw error;
  }
};

const getUserById = async (userId, token) => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/users/profile/${userId}`, {
      headers: {
        Authorization: `${token}`,
      },
    }); 
    return response.data;
  } catch (error) {
    console.error("Error fetching user by ID:", error.response?.data || error.message);
    throw error;
  }
}


export { getUserProfile, getUserById };
