import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ingredient: null,
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    selectIngredient: (state, action) => {
      state.ingredient = action.payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { selectIngredient, clearIngredient } = selectedSlice.actions;
export default selectedSlice.reducer;
