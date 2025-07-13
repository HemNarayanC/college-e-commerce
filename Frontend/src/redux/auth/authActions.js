// src/redux/auth/authActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { login, register } from "../../api/authApi";
import { vendorLogin } from "../../api/vendorApi";

const loginUser = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await login(data);
      const { token, user } = response.data;

      Cookies.set("auth_token", token, { expires: 1 });

      // Return both user and token
      return { user, token }; 
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Login failed");
    }
  }
);

const registerUser = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await register(data);
      const { token, user } = response.data;
      return { user, token };
    } catch (error) {
      return rejectWithValue(error?.response?.data || "Registration failed");
    }
  }
);

const loginVendor = createAsyncThunk(
  "auth/loginVendor",
  async (data, { rejectWithValue }) => {
    try {
      const response = await vendorLogin(data);
      // console.log("Vendor Data", response);

      const { token, user, vendor } = response;

      // Cookies.set("auth_token", token, { expires: 1 });

      return { user, vendor, token };
    } catch (error) {
      console.error("Caught in loginVendor thunk:", error);
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Vendor login failed"
      );
    }
  }
);


export { loginUser, registerUser, loginVendor };
