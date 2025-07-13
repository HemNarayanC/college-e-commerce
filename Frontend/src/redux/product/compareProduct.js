import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  compareList: [],
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action) => {
      const product = action.payload;
      const exists = state.compareList.find((p) => p.id === product.id);
      if (!exists) {
        state.compareList.push(product);
      }
    },
    removeFromCompare: (state, action) => {
      state.compareList = state.compareList.filter((p) => p.id !== action.payload);
    },
    clearCompare: (state) => {
      state.compareList = [];
    },
  },
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
