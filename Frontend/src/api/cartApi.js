// src/api/cartApi.js
import axios from "axios";
import { config } from "../config/config";

const getCart = async (token) => {
  const res = await axios.get(`${config.baseApiUrl}/users/cart`, {
    withCredentials: true,
    headers: {
      Authorization: `${token}`,
    },
  });
  //   console.log("getting cart", res)
  return res.data;
};

const addToCart = async ({
  token,
  productId,
  variantId = null,
  quantity = 1,
}) => {
  const payload = { productId, quantity };
  if (variantId) payload.variantId = variantId;
  console.log(payload);

  const res = await axios.post(`${config.baseApiUrl}/users/cart`, payload, {
    withCredentials: true,
    headers: {
      Authorization: `${token}`,
    },
  });

  return res.data;
};

const updateCart = async ({ token, productId, variantId = null, quantity }) => {
  console.log("From cartApi", productId, variantId, quantity);
  //   const payload = { productId, variantId, quantity };
  //   if (variantId) payload.variantId = variantId;

  const res = await axios.put(
    `${config.baseApiUrl}/users/cart`,
    { productId, variantId, quantity },
    {
      withCredentials: true,
      headers: {
        Authorization: `${token}`,
      },
    }
  );
  return res.data;
};

const removeFromCart = async ({ token, cartId }) => {
  const url = `${config.baseApiUrl}/users/cart/${cartId}`;
  const res = await axios.delete(url, {
    withCredentials: true,
    headers: {
      Authorization: `${token}`,
    },
  });
  return res.data;
};

const clearCart = async (token) => {
  const res = await axios.delete(`${config.baseApiUrl}/users/cart`, {
    withCredentials: true,
    headers: {
      Authorization: `${token}`,
    },
  });
  return res.data;
};

export { getCart, addToCart, updateCart, removeFromCart, clearCart };
