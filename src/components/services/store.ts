import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api';
import burgerSlice from './ingredients/burgerSlice';
import selectedSlice from './ingredients/selectedSlice';
import { ordersApi } from './orders/api';
import selectedOrderSlice from './orders/selectedOrderSlice';
import { userApi } from './user/api';
import userSlice from './user/userSlice';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [ordersApi.reducerPath]: ordersApi.reducer,
  selected: selectedSlice,
  burger: burgerSlice,
  user: userSlice,
  selectedOrder: selectedOrderSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware()
      .concat(ingredientsApi.middleware)
      .concat(userApi.middleware)
      .concat(ordersApi.middleware);
  },
});

// Добавьте console.log для проверки
console.log('Store initialized with reducers:', {
  hasSelected: !!store.getState().selected,
  hasUser: !!store.getState().user,
  hasSelectedOrder: !!store.getState().selectedOrder,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
