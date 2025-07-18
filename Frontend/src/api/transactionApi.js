import axios from "axios";
import { config } from "../config/config";
export const saveCODTransaction = async (data, token) => {
  const response = await axios.post(`${config.baseApiUrl}/transactions/cod`,
    data,
    {
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return response.data;
};
