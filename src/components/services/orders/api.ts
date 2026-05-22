import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { URL } from '@utils/constants';

export type Order = {
  _id: string;
  ingredients: string[];
  status: string;
  number: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
};

export type OrdersResponse = {
  success: boolean;
  orders: Order[];
  total: number;
  totalToday: number;
};

type OrderResponse = {
  success: boolean;
  order: Order;
  total: number;
  totalToday: number;
};

export const ordersApi = createApi({
  reducerPath: 'ordersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: URL,
  }),
  endpoints: (builder) => ({
    // WebSocket соединение для ленты заказов
    getOrders: builder.query<OrdersResponse, void>({
      queryFn: () => ({ data: null as never }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const ws = new WebSocket(
          'wss://new-stellarburgers.education-services.ru/orders/all'
        );

        try {
          await cacheDataLoaded;

          ws.onmessage = (event: MessageEvent): void => {
            const data: OrdersResponse = JSON.parse(event.data);
            updateCachedData(() => data);
          };

          ws.onerror = (error: Event): void => {
            console.error('WebSocket error:', error);
          };
        } catch (error) {
          console.error('Cache data loaded error:', error);
        }

        await cacheEntryRemoved;
        ws.close();
      },
    }),

    getOrdersById: builder.query<Order | null, string>({
      query: (id_order) => `/api/orders/${id_order}`,
      transformResponse: (response: OrderResponse) => {
        return response.order;
      },
    }),

    getProfileOrders: builder.query<OrdersResponse, void>({
      queryFn: () => ({ data: null as never }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        const getToken = (): string | null => {
          const token = localStorage.getItem('accessToken');
          return token ? token.replace('Bearer ', '') : null;
        };

        const token = getToken();
        if (!token) {
          console.error('Токен не найден');
          return;
        }

        const ws = new WebSocket(
          `wss://new-stellarburgers.education-services.ru/orders?token=${token}`
        );

        try {
          await cacheDataLoaded;

          ws.onmessage = (event: MessageEvent): void => {
            const data = JSON.parse(event.data);

            if (data.message === 'Invalid or missing token') {
              console.error('Ошибка авторизации WebSocket:', data.message);
              ws.close();
              return;
            }

            const response: OrdersResponse = data;
            updateCachedData(() => response);
          };

          ws.onerror = (error: Event): void => {
            console.error('Profile WebSocket error:', error);
          };

          ws.onclose = (): void => {
            console.log('Profile WebSocket disconnected');
          };
        } catch (error) {
          console.error('Cache data loaded error:', error);
        }

        await cacheEntryRemoved;
        ws.close();
      },
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrdersByIdQuery, useGetProfileOrdersQuery } =
  ordersApi;
