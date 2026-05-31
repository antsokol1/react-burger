// src/components/services/user/userSlice.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

import userReducer, {
  setUser,
  clearUser,
  setIsAuthChecked,
  selectIsAuthChecked,
  selectUser,
  initialState,
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
    expect(result).toEqual(initialState);
  });

  it('setUser должен устанавливать пользователя', () => {
    const result = userReducer(initialState, setUser(mockUser));
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthChecked).toBe(false);
  });

  it('setUser с null должен сбрасывать пользователя', () => {
    // Сначала устанавливаем пользователя
    const stateWithUser = userReducer(initialState, setUser(mockUser));
    // Затем сбрасываем через setUser(null)
    const result = userReducer(stateWithUser, setUser(null));
    expect(result.user).toBeNull();
    expect(result.isAuthChecked).toBe(false);
  });

  it('setIsAuthChecked должен устанавливать флаг проверки', () => {
    const result = userReducer(initialState, setIsAuthChecked(true));
    expect(result.isAuthChecked).toBe(true);
    expect(result.user).toBeNull();
  });

  it('clearUser должен очищать пользователя и устанавливать isAuthChecked в true', () => {
    // Сначала устанавливаем пользователя
    const stateWithUser = userReducer(initialState, setUser(mockUser));
    // Затем вызываем clearUser
    const result = userReducer(stateWithUser, clearUser());
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
    const state = { user: initialState } as RootState; // ← 4. Используем initialState
    expect(selectUser(state)).toBeNull();
  });
});
