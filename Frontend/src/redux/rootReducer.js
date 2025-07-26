// src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice"
import compareReducer from "../redux/product/compareProduct";
import cartCountReducer from "../redux/cart/cartSlice"

const rootReducer = combineReducers({
  cartCount: cartCountReducer,
  compare: compareReducer,
  auth: authReducer,
});

export default rootReducer;
