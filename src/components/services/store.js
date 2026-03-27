import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api';
import burgerSlice from './ingredients/burgerSlice';
import selectedSlice from './ingredients/selectedSlice';

const rootReducer = combineSlices({
  [ingredientsApi.reducerPath]: ingredientsApi.reducer,
  selected: selectedSlice,
  burger: burgerSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(ingredientsApi.middleware);
  },
});
