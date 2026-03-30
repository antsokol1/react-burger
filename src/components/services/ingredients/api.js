import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { URL } from '@utils/constants';

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query({
      query: () => '/api/ingredients',
      transformResponse: (response) => response.data,
    }),
    createOrder: builder.mutation({
      query: (ingredients) => ({
        url: '/api/orders',
        method: 'POST',
        body: {
          ingredients: ingredients,
        },
      }),
    }),
  }),
});

export const { useGetIngredientsQuery, useCreateOrderMutation } = ingredientsApi;
