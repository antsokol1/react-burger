import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userApi } from './api';

const initialState = {
  user: null,
  isAuthChecked: false,
};

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (localStorage.getItem('accessToken')) {
        const result = await dispatch(userApi.endpoints.getUser.initiate()).unwrap();
        dispatch(setUser(result));
      }
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsAuthChecked: (state, action) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.isAuthChecked = true;
    },
  },
});

export const { setUser, clearUser, setIsAuthChecked } = userSlice.actions;

// Селекторы
export const selectIsAuthChecked = (state) => state.user.isAuthChecked;
export const selectUser = (state) => state?.user?.user;

export default userSlice.reducer;
