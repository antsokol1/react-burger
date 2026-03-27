import { createSlice, nanoid, createSelector } from '@reduxjs/toolkit';

const initialState = {
  bun: null,
  ingredients: [],
};

const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addBun: (state, action) => {
      state.bun = action.payload;
    },
    addIngredient: (state, action) => {
      const ingredient = action.payload;
      state.ingredients.push({
        ...ingredient,
        customId: nanoid(),
      });
    },
    deleteIngredient: (state, action) => {
      const customId = action.payload;
      state.ingredients = state.ingredients.filter((item) => item.customId !== customId);
    },
    moveIngredient: (state, action) => {
      const { dragId, hoverId } = action.payload;

      const dragIndex = state.ingredients.findIndex((item) => item.customId === dragId);
      const hoverIndex = state.ingredients.findIndex(
        (item) => item.customId === hoverId
      );

      const [draggedItem] = state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, draggedItem);
    },
  },
});

export const { addBun, addIngredient, deleteIngredient, moveIngredient } =
  burgerSlice.actions;
export default burgerSlice.reducer;

export const selectBun = (state) => state.burger.bun;
export const selectIngredients = (state) => state.burger.ingredients;

export const selectCount = createSelector(
  [selectBun, selectIngredients],
  (bun, ingredients) => {
    const count = {};

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
    console.log(totalPrice);
    return totalPrice;
  }
);
