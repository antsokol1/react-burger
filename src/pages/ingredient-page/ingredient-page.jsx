import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useGetIngredientsQuery } from '@/components/services/ingredients/api';
import { selectIngredient } from '@/components/services/ingredients/selectedSlice';

import styles from './ingredient-page.module.css';

export const IngredientPage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, data: ingredients } = useGetIngredientsQuery();

  useEffect(() => {
    if (!isLoading && ingredients.length > 0 && id) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(selectIngredient(ingredient));
      }
    }
  }, [id, ingredients]);

  return (
    <section className={styles.container}>
      <h1 className="text text_type_main-large mt-20 mb-5 text-center">
        Детали ингредиента
      </h1>
      <IngredientDetails />
    </section>
  );
};
