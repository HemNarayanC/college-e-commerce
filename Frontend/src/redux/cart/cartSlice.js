// src/redux/cartCountSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  itemCount: 0,
};

const cartCountSlice = createSlice({
  name: "cartCount",
  initialState,
  reducers: {
    setItemCount: (state, action) => {
      state.itemCount = action.payload;
    },
    clearItemCount: (state) => {
      state.itemCount = 0;
    },
  },
});

export const { setItemCount, clearItemCount } = cartCountSlice.actions;
export default cartCountSlice.reducer;
