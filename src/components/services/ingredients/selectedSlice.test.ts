import { describe, it, expect } from 'vitest';

import selectedReducer, {
  selectIngredient,
  clearIngredient,
  initialState,
} from './selectedSlice';

import type { Ingredient } from '../ingredients/api';

describe('selectedSlice', () => {
  const mockIngredient: Ingredient = {
    _id: '1',
    name: 'Тестовый ингредиент',
    type: 'main',
    price: 100,
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    image: 'test.png',
    image_mobile: 'test.png',
    image_large: 'test.png',
    __v: 0,
  };

  it('должен возвращать начальное состояние', () => {
    const result = selectedReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('selectIngredient должен выбирать ингредиент', () => {
    const result = selectedReducer(initialState, selectIngredient(mockIngredient));
    expect(result.ingredient).toEqual(mockIngredient);
  });

  it('clearIngredient должен очищать выбранный ингредиент', () => {
    // Сначала выбираем ингредиент
    const stateWithIngredient = selectedReducer(
      initialState,
      selectIngredient(mockIngredient)
    );
    // Затем очищаем
    const result = selectedReducer(stateWithIngredient, clearIngredient());
    expect(result.ingredient).toBeNull();
    expect(result).toEqual(initialState);
  });
});
