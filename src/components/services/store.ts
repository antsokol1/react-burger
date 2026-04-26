import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api';
import burgerSlice from './ingredients/burgerSlice';
import selectedSlice from './ingredients/selectedSlice';
import { userApi } from './user/api';
import userSlice from './user/userSlice';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  selected: selectedSlice,
  burger: burgerSlice,
  user: userSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(ingredientsApi.middleware)
      .concat(userApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
