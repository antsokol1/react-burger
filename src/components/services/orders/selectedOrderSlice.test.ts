import { describe, it, expect } from 'vitest';

import selectedOrderReducer, { selectOrder, clearOrder } from './selectedOrderSlice';

import type { Order } from './api';

describe('selectedOrderSlice', () => {
  const mockOrder: Order = {
    _id: 'order1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Флюоресцентный бургер',
    createdAt: '2024-01-01T12:00:00Z',
    updatedAt: '2024-01-01T12:00:00Z',
    number: 12345,
  };

  it('должен возвращать начальное состояние', () => {
    const result = selectedOrderReducer(undefined, { type: '' });
    expect(result).toEqual({ order: null });
  });

  it('selectOrder должен выбирать заказ', () => {
    const mockState = { order: null };
    const result = selectedOrderReducer(mockState, selectOrder(mockOrder));
    expect(result.order).toEqual(mockOrder);
  });

  it('clearOrder должен очищать выбранный заказ', () => {
    const mockState = { order: mockOrder };
    const result = selectedOrderReducer(mockState, clearOrder());
    expect(result.order).toBeNull();
  });
});
