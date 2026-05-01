import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { URL } from '@utils/constants';

export type Ingredient = {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

type IngredientsResponse = {
  success: boolean;
  data: Ingredient[];
};

type OrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export const ingredientsApi = createApi({
  reducerPath: 'ingredientsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  endpoints: (builder) => ({
    getIngredients: builder.query<Ingredient[], void>({
      query: () => '/api/ingredients',
      transformResponse: (response: IngredientsResponse) => response.data,
    }),
    createOrder: builder.mutation<OrderResponse, string[]>({
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
