import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { loginUser, loginVendor, registerUser } from "./authActions";

const initialState = {
  loading: false,
  user: null,
  vendor: null,
  auth_token: Cookies.get("auth_token") || null,
  error: null,
  isAuthenticated: false,
  registerSuccess: false,  // new flag
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutUser: (state) => {
      Cookies.remove("auth_token");
      state.user = null;
      state.vendor = null;
      state.auth_token = null;
      state.error = null;
      state.isAuthenticated = false;
      state.registerSuccess = false;
    },
    setUserFromToken: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.registerSuccess = false;
    },
    clearRegisterSuccess: (state) => {
      state.registerSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.auth_token = action.payload.token;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.registerSuccess = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registerSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.registerSuccess = true;
        state.user = null;
        state.auth_token = null;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Registration failed";
        state.isAuthenticated = false;
        state.registerSuccess = false;
      })
       .addCase(loginVendor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginVendor.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.vendor = action.payload.vendor;
        state.auth_token = action.payload.token;
        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;
        state.registerSuccess = false;
      })
      .addCase(loginVendor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Vendor login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logoutUser, setUserFromToken, clearRegisterSuccess } = authSlice.actions;
export default authSlice.reducer;
