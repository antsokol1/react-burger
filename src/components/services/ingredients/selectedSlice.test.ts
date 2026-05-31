import { describe, it, expect } from 'vitest';

import selectedReducer, { selectIngredient, clearIngredient } from './selectedSlice';

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
    expect(result).toEqual({ ingredient: null });
  });

  it('selectIngredient должен выбирать ингредиент', () => {
    const mockState = { ingredient: null };
    const result = selectedReducer(mockState, selectIngredient(mockIngredient));
    expect(result.ingredient).toEqual(mockIngredient);
  });

  it('clearIngredient должен очищать выбранный ингредиент', () => {
    const mockState = { ingredient: mockIngredient };
    const result = selectedReducer(mockState, clearIngredient());
    expect(result.ingredient).toBeNull();
  });
});
