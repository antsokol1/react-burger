import { createApi } from '@reduxjs/toolkit/query/react';

import { fetchWithRefresh } from '@/utils/token';

import type { BaseQueryFn } from '@reduxjs/toolkit/query/react';

export type User = {
  email: string;
  name: string;
};

export type AuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type AuthRequest = {
  email: string;
  password: string;
  name?: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LogoutRequest = {
  token: string;
};

export type LogoutResponse = {
  success: boolean;
  message?: string;
};

export type ForgotRequest = {
  email: string;
};

export type ForgotResponse = {
  success: boolean;
  message?: string;
};

export type ResetRequest = {
  password: string;
  token: string;
};

export type ResetResponse = {
  success: boolean;
  message?: string;
};

export type GetUserResponse = {
  success: boolean;
  user: User;
};

export type UpdateUserRequest = {
  email?: string;
  name?: string;
  password?: string;
};

type BaseQueryArgs = {
  url: string;
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
};

const baseQueryWithRefresh: BaseQueryFn<BaseQueryArgs, unknown, unknown> = async (
  args
) => {
  const { url, method = 'GET', body, ...rest } = args;
  const token = localStorage.getItem('accessToken');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...rest.headers,
  };

  if (token) {
    headers.authorization = token;
  }

  const options: RequestInit = {
    method,
    headers,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const data = await fetchWithRefresh(url, options);
  return { data };
};

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
      invalidatesTags: ['User'],
    }),
    login: builder.mutation<User, LoginRequest>({
      query: (userData) => ({
        url: 'auth/login',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: AuthResponse) => {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        return response.user;
      },
      invalidatesTags: ['User'],
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
        body: {
          token: localStorage.getItem('refreshToken'),
        },
      }),
      transformResponse: (response: LogoutResponse) => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
      },
    }),
    forgot: builder.mutation<ForgotResponse, string>({
      query: (email) => ({
        url: 'password-reset',
        method: 'POST',
        body: {
          email: email,
        },
      }),
    }),
    reset: builder.mutation<ResetResponse, ResetRequest>({
      query: ({ password, token }) => ({
        url: 'password-reset/reset',
        method: 'POST',
        body: {
          password: password,
          token: token,
        },
      }),
    }),
    getUser: builder.query<User, void>({
      query: () => ({
        url: 'auth/user',
        method: 'GET',
      }),
      transformResponse: (response: GetUserResponse) => response.user,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: (userData) => ({
        url: 'auth/user',
        method: 'PATCH',
        body: userData,
      }),
      transformResponse: (response: GetUserResponse) => response.user,
      invalidatesTags: ['User'],
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
