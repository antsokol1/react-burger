import { describe, it, expect } from 'vitest';

import selectedOrderReducer, {
  selectOrder,
  clearOrder,
  initialState,
} from './selectedOrderSlice';

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
    expect(result).toEqual(initialState);
  });

  it('selectOrder должен выбирать заказ', () => {
    const result = selectedOrderReducer(initialState, selectOrder(mockOrder));
    expect(result.order).toEqual(mockOrder);
  });

  it('clearOrder должен очищать выбранный заказ', () => {
    // Сначала выбираем ингредиент
    const stateWithIngredient = selectedOrderReducer(
      initialState,
      selectOrder(mockOrder)
    );
    // Затем очищаем
    const result = selectedOrderReducer(stateWithIngredient, clearOrder());
    expect(result.order).toBeNull();
  });
});
