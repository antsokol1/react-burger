import { createSlice } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { Order } from './api';

type SelectedState = {
  order: Order | null;
};

export const initialState: SelectedState = {
  order: null,
};

const selectedOrderSlice = createSlice({
  name: 'selectedOrder',
  initialState,
  reducers: {
    selectOrder: (state, action: PayloadAction<Order>) => {
      state.order = action.payload;
    },
    clearOrder: (state) => {
      state.order = null;
    },
  },
});

export const { selectOrder, clearOrder } = selectedOrderSlice.actions;
export default selectedOrderSlice.reducer;
