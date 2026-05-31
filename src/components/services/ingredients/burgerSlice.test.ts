import { describe, it, expect } from 'vitest';

import burgerReducer, {
  addBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
  selectBun,
  selectIngredients,
  selectCount,
  selectPrice,
  initialState,
} from './burgerSlice';

import type { RootState } from '../store';
import type { Ingredient } from './api';

describe('burgerSlice', () => {
  // Моковые данные
  const mockBun: Ingredient = {
    _id: 'bun1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 125,
    proteins: 80,
    fat: 20,
    carbohydrates: 50,
    calories: 420,
    image: 'https://example.com/bun.png',
    image_mobile: 'https://example.com/bun-mobile.png',
    image_large: 'https://example.com/bun-large.png',
    __v: 0,
  };

  const mockIngredient1: Ingredient = {
    _id: 'ing1',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    price: 88,
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    image: 'https://example.com/ing1.png',
    image_mobile: 'https://example.com/ing1-mobile.png',
    image_large: 'https://example.com/ing1-large.png',
    __v: 0,
  };

  const mockIngredient2: Ingredient = {
    _id: 'ing2',
    name: 'Соус Spicy-X',
    type: 'sauce',
    price: 30,
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    image: 'https://example.com/ing2.png',
    image_mobile: 'https://example.com/ing2-mobile.png',
    image_large: 'https://example.com/ing2-large.png',
    __v: 0,
  };

  it('должен возвращать начальное состояние', () => {
    const result = burgerReducer(undefined, { type: '' });
    expect(result).toEqual(initialState);
  });

  it('должен добавлять булку при addBun', () => {
    const result = burgerReducer(initialState, addBun(mockBun));
    expect(result.bun).toEqual(mockBun);
    expect(result.ingredients).toEqual([]);
  });

  it('должен добавлять ингредиент с customId при addIngredient', () => {
    const stateWithBun = burgerReducer(initialState, addBun(mockBun));
    const result = burgerReducer(stateWithBun, addIngredient(mockIngredient1));
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toMatchObject(mockIngredient1);
    expect(result.ingredients[0].customId).toBeDefined();
  });

  it('должен удалять ингредиент по customId при deleteIngredient', () => {
    // Сначала добавляем булку и ингредиент
    let state = burgerReducer(initialState, addBun(mockBun));
    state = burgerReducer(state, addIngredient(mockIngredient1));
    const customId = state.ingredients[0].customId;

    // Затем удаляем
    const result = burgerReducer(state, deleteIngredient(customId));
    expect(result.ingredients).toHaveLength(0);
    expect(result.bun).toEqual(mockBun); // булка должна остаться
  });

  it('должен перемещать ингредиент при moveIngredient', () => {
    // Добавляем булку и три ингредиента
    let state = burgerReducer(initialState, addBun(mockBun));
    state = burgerReducer(state, addIngredient(mockIngredient1));
    state = burgerReducer(state, addIngredient(mockIngredient2));
    state = burgerReducer(state, addIngredient(mockIngredient1));

    const dragId = state.ingredients[2].customId;
    const hoverId = state.ingredients[0].customId;

    const result = burgerReducer(state, moveIngredient({ dragId, hoverId }));
    expect(result.ingredients[0]._id).toBe(mockIngredient1._id);
    expect(result.ingredients[2]._id).toBe(mockIngredient2._id);
  });

  it('должен очищать конструктор при clearConstructor', () => {
    // Создаем заполненное состояние
    let state = burgerReducer(initialState, addBun(mockBun));
    state = burgerReducer(state, addIngredient(mockIngredient1));
    state = burgerReducer(state, addIngredient(mockIngredient2));

    const result = burgerReducer(state, clearConstructor());
    expect(result).toEqual(initialState); // ← сравниваем с initialState
  });

  describe('селекторы', () => {
    it('selectBun должен возвращать булку', () => {
      const mockState = {
        burger: { bun: mockBun, ingredients: [] },
      } as RootState;

      const result = selectBun(mockState);

      expect(result).toEqual(mockBun);
    });

    it('selectIngredients должен возвращать массив ингредиентов', () => {
      const ingredients = [{ ...mockIngredient1, customId: '1' }];
      const mockState = {
        burger: { bun: mockBun, ingredients },
      } as RootState;
      const result = selectIngredients(mockState);
      expect(result).toEqual(ingredients);
    });

    it('selectCount должен подсчитывать количество ингредиентов, включая булку как 2 штуки', () => {
      const mockState = {
        burger: {
          bun: mockBun,
          ingredients: [
            { ...mockIngredient1, customId: '1' },
            { ...mockIngredient1, customId: '2' },
            { ...mockIngredient2, customId: '3' },
          ],
        },
      } as RootState;
      const result = selectCount(mockState);
      expect(result[mockBun._id]).toBe(2);
      expect(result[mockIngredient1._id]).toBe(2);
      expect(result[mockIngredient2._id]).toBe(1);
    });

    it('selectPrice должен подсчитывать общую стоимость с булкой', () => {
      const mockState = {
        burger: {
          bun: mockBun,
          ingredients: [{ ...mockIngredient1, customId: '1' }],
        },
      } as RootState;

      const result = selectPrice(mockState);
      expect(result).toBe(mockBun.price * 2 + mockIngredient1.price);
    });

    it('selectPrice должен возвращать 0 если ничего нет', () => {
      const mockState = {
        burger: {
          bun: null,
          ingredients: [],
        },
      } as RootState;

      const result = selectPrice(mockState);
      expect(result).toBe(0);
    });
  });
});
