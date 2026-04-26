import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../store';
import type { Ingredient } from './api';

// Тип для ингредиента в конструкторе (с customId)
export type ConstructorIngredient = {
  customId: string;
} & Ingredient;

// Тип для состояния
type BurgerState = {
  bun: Ingredient | null;
  ingredients: ConstructorIngredient[];
};

// Тип для перемещения ингредиента
type MoveState = {
  dragId: string;
  hoverId: string;
};

const initialState: BurgerState = {
  bun: null,
  ingredients: [],
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBun: (state, action: PayloadAction<Ingredient>) => {
      state.bun = action.payload;
    },
    addIngredient: {
      prepare: (ingredient: Ingredient) => ({
        payload: {
          ...ingredient,
          customId: nanoid(),
        },
      }),
      reducer: (state, action: PayloadAction<ConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
    },
    deleteIngredient: (state, action: PayloadAction<string>) => {
      const customId = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.customId !== customId);
    },
    moveIngredient: (state, action: PayloadAction<MoveState>) => {
      const { dragId, hoverId } = action.payload;

      const dragIndex = state.ingredients.findIndex((item) => item.customId === dragId);
      const hoverIndex = state.ingredients.findIndex(
        (item) => item.customId === hoverId
      );

      const [draggedItem] = state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
  },
});

export const {
  addBun,
  addIngredient,
  deleteIngredient,
  moveIngredient,
  clearConstructor,
} = burgerSlice.actions;
export default burgerSlice.reducer;

export const selectBun = (state: RootState): Ingredient | null => state.burger.bun;
export const selectIngredients = (state: RootState): Ingredient[] =>
  state.burger.ingredients;

export const selectCount = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    const count: Record<string, number> = {};

    ingredients.forEach((item) => {
      const id = item._id;
      count[id] = (count[id] || 0) + 1;
    });

    if (bun) {
      const id = bun._id;
      count[id] = (count[id] || 0) + 2;
    }
    console.log(count);
    return count;
  }
);

export const selectPrice = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    let totalPrice = 0;

    ingredients.forEach((item) => {
      totalPrice += item.price;
    });

    if (bun) {
      totalPrice += bun.price * 2;
    }
    return totalPrice;
  }
);
