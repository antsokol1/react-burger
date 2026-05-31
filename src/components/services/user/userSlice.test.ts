// src/components/services/user/userSlice.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

import userReducer, {
  setUser,
  clearUser,
  setIsAuthChecked,
  selectIsAuthChecked,
  selectUser,
} from './userSlice';

import type { RootState } from '../store';

describe('userSlice', () => {
  const mockUser = {
    email: 'test@example.com',
    name: 'Тестовый Пользователь',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('должен возвращать начальное состояние', () => {
    const result = userReducer(undefined, { type: '' });
    expect(result).toEqual({ user: null, isAuthChecked: false });
  });

  it('setUser должен устанавливать пользователя', () => {
    const result = userReducer({ user: null, isAuthChecked: false }, setUser(mockUser));
    expect(result.user).toEqual(mockUser);
  });

  it('setUser с null должен сбрасывать пользователя', () => {
    const result = userReducer({ user: mockUser, isAuthChecked: true }, setUser(null));
    expect(result.user).toBeNull();
  });

  it('setIsAuthChecked должен устанавливать флаг проверки', () => {
    const result = userReducer(
      { user: null, isAuthChecked: false },
      setIsAuthChecked(true)
    );
    expect(result.isAuthChecked).toBe(true);
  });

  it('clearUser должен очищать пользователя и устанавливать isAuthChecked в true', () => {
    const result = userReducer({ user: mockUser, isAuthChecked: false }, clearUser());
    expect(result.user).toBeNull();
    expect(result.isAuthChecked).toBe(true);
  });

  it('selectIsAuthChecked должен возвращать флаг проверки', () => {
    const state = { user: { user: null, isAuthChecked: true } } as RootState;
    expect(selectIsAuthChecked(state)).toBe(true);
  });

  it('selectUser должен возвращать пользователя', () => {
    const state = { user: { user: mockUser, isAuthChecked: true } } as RootState;
    expect(selectUser(state)).toEqual(mockUser);
  });

  it('selectUser должен возвращать null если пользователя нет', () => {
    const state = { user: { user: null, isAuthChecked: true } } as RootState;
    expect(selectUser(state)).toBeNull();
  });
});
