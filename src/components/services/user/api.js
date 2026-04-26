import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchWithRefresh } from '@/utils/token';

async function baseQueryWithRefresh(args) {
  const { url, method = 'GET', ...rest } = args;
  const token = localStorage.getItem('accessToken');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.authorization = token;
  }

  const options = {
    method,
    headers,
    ...rest,
  };

  const data = await fetchWithRefresh(url, options);
  return { data };
}

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: JSON.stringify(userData),
      }),
      transformResponse: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
    }),
    login: builder.mutation({
      query: (userData) => ({
        url: 'auth/login',
        method: 'POST',
        body: JSON.stringify(userData),
      }),
      transformResponse: (response) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        body: JSON.stringify({
          token: localStorage.getItem('refreshToken'),
        }),
      }),
      transformResponse: (response) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      },
    }),
    forgot: builder.mutation({
      query: (emailData) => ({
        url: 'password-reset',
        method: 'POST',
        body: JSON.stringify({
          email: emailData,
        }),
      }),
    }),
    reset: builder.mutation({
      query: (password, token) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body: JSON.stringify({
          password: password,
          token: token,
        }),
      }),
    }),
    getUser: builder.query({
      query: () => ({
        url: 'auth/user',
        method: 'GET',
      }),
      transformResponse: (response) => response.user,
    }),
    updateUser: builder.mutation({
      query: (userData) => ({
        url: 'auth/user',
        method: 'PATCH',
        body: JSON.stringify(userData),
      }),
      transformResponse: (response) => response.user,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useForgotMutation,
  useResetMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} = userApi;
