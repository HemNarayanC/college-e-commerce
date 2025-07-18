// src/redux/auth/authActions.js
import { createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { login, register } from "../../api/authApi";
import { vendorLogin } from "../../api/vendorApi";

const loginUser = createAsyncThunk(
  "auth/login",
  async (
    { email, password, expectedRole, rememberMe },
    { rejectWithValue }
  ) => {
    try {
      const response = await login({ email, password });
      const { token, user } = response.data;

      // Defensive: check user.role or user.roles array
      const roles = Array.isArray(user.role)
        ? user.role
        : Array.isArray(user.roles)
        ? user.roles
        : [];

      // Check if expectedRole exists in roles array
      if (expectedRole && !roles.includes(expectedRole)) {
        return rejectWithValue(`Invalid role`);
      }

      // Only set cookie after role is valid
      if (rememberMe) {
        Cookies.set("auth_token", token, { expires: 7 }); // 7 days
      } else {
        Cookies.set("auth_token", token);
      }

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
  async ({ email, password, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await vendorLogin({ email, password });
      const { token, user, vendor } = response;

      if (rememberMe) {
        Cookies.set("auth_token", token, { expires: 7 });
      } else {
        Cookies.set("auth_token", token);
      }

      return { user, vendor, token };
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Vendor login failed"
      );
    }
  }
);


export { loginUser, registerUser, loginVendor };
