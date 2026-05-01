import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { useGetIngredientsQuery } from '@/components/services/ingredients/api';
import { selectIngredient } from '@/components/services/ingredients/selectedSlice';

import type { Ingredient } from '@/components/services/ingredients/api';
import type { AppDispatch } from '@/components/services/store';

import styles from './ingredient-page.module.css';

export const IngredientPage = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, data: ingredientsData } = useGetIngredientsQuery();
  const ingredients: Ingredient[] = ingredientsData || [];

  useEffect(() => {
    if (!isLoading && ingredients.length > 0 && id) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(selectIngredient(ingredient));
      }
    }
  }, [id, ingredients, isLoading, dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={styles.container}>
      <h1 className="text text_type_main-large mt-20 mb-5 text-center">
        Детали ингредиента
      </h1>
      <IngredientDetails />
    </section>
  );
};
