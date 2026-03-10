import { useState, useEffect } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
// import { ingredients } from '@utils/ingredients';
import { getIngredients } from '@utils/api';

import styles from './app.module.css';

export const App = () => {
  const [isLoading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getIngredients();
        setIngredients(data);
      } catch (e) {
        console.error('Ошибка загрузки:', e);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  console.log('ingredients is', ingredients);

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} isLoading={isLoading} />
        <BurgerConstructor ingredients={ingredients} isLoading={isLoading} />
      </main>
    </div>
  );
};
