import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
import { Modal } from '@/components/modal/modal';
import { useGetIngredientsQuery } from '@/components/services/ingredients/api';
import {
  clearIngredient,
  selectIngredient,
} from '@/components/services/ingredients/selectedSlice';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import styles from './home.module.css';

export const Home = () => {
  const dispatch = useDispatch();
  const selectedIngredient = useSelector((state) => state.selected.ingredient);

  const navigate = useNavigate();
  const { id } = useParams();

  const { data: ingredients } = useGetIngredientsQuery();

  useEffect(() => {
    if (id && ingredients.length) {
      const ingredient = ingredients.find((item) => item._id === id);
      if (ingredient) {
        dispatch(selectIngredient(ingredient));
      }
    }
  }, [id]);

  function closeModal() {
    dispatch(clearIngredient());
    navigate(-1);
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.container}>
        <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
          Соберите бургер
        </h1>
        <div className={styles.content}>
          <BurgerIngredients />
          <BurgerConstructor />
          {selectedIngredient && (
            <Modal title={'Детали ингредиента'} onClose={closeModal}>
              <IngredientDetails />
            </Modal>
          )}
        </div>
      </div>
    </DndProvider>
  );
};
