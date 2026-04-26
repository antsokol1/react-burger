import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { userApi } from './api';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState, AppDispatch } from '../store';

type User = {
  email: string;
  name: string;
};

type UserState = {
  user: User | null;
  isAuthChecked: boolean;
};

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
};

export const checkUserAuth = createAsyncThunk<void, void, { dispatch: AppDispatch }>(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    try {
      if (localStorage.getItem('accessToken')) {
        const result = await dispatch(
          userApi.endpoints.getUser.initiate(undefined)
        ).unwrap();
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
    setIsAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    },
    setUser: (state, action: PayloadAction<User | null>) => {
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
export const selectIsAuthChecked = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const selectUser = (state: RootState): User | null => state.user.user;

export default userSlice.reducer;
