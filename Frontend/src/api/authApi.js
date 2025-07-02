import axios from "axios";
import { config } from "../config/config";

const login = async (data) => {
  const response = await axios.post(`${config.baseApiUrl}/auth/login`, {
    email: data.email,
    password: data.password
  });

  return response;
};

const logout = async () => {
  const response = await axios.post(`${config.baseApiUrl}/auth/logout`);
  return response;
};

export { login, logout };
