import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Ingredient } from '../ingredients/api';

type SelectedState = {
  ingredient: Ingredient | null; // может быть ингредиент или null
};

const initialState: SelectedState = {
  ingredient: null,
};

const selectedSlice = createSlice({
  name: 'selected',
  initialState,
  reducers: {
    selectIngredient: (state, action: PayloadAction<Ingredient>) => {
      state.ingredient = action.payload;
    },
    clearIngredient: (state) => {
      state.ingredient = null;
    },
  },
});

export const { selectIngredient, clearIngredient } = selectedSlice.actions;
export default selectedSlice.reducer;
