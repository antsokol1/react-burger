import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientsApi } from './ingredients/api';

const rootReducer = combineSlices(ingredientsApi);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().concat(ingredientsApi.middleware);
  },
});
