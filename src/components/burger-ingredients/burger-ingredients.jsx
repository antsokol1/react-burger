import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import { IngredientCard } from '@/components/ingredient-card/ingredient-card';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  console.log(ingredients);

  const [tabValue, setTabValue] = useState('bun');

  const groupedIngredients = {
    bun: ingredients.filter((item) => item.type === 'bun'),
    main: ingredients.filter((item) => item.type === 'main'),
    sauce: ingredients.filter((item) => item.type === 'sauce'),
  };

  const bunRef = useRef(null);
  const mainRef = useRef(null);
  const sauceRef = useRef(null);

  const refs = {
    bun: bunRef,
    main: mainRef,
    sauce: sauceRef,
  };

  function handleTab(value) {
    setTabValue(value);
    refs[value].current?.scrollIntoView({ bahavior: 'smooth' });
  }

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab value="bun" active={tabValue === 'bun'} onClick={() => handleTab('bun')}>
            Булки
          </Tab>
          <Tab
            value="main"
            active={tabValue === 'main'}
            onClick={() => handleTab('main')}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={tabValue === 'sauce'}
            onClick={() => handleTab('sauce')}
          >
            Соусы
          </Tab>
        </ul>
      </nav>

      <section className={`${styles.all_ingredients} ${styles.custom_scroll}`}>
        <section ref={bunRef}>
          <div className="text text_type_main-small">Булки</div>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.bun.map((ingredient) => (
              <li key={ingredient._id}>
                <IngredientCard ingredient={ingredient} />
              </li>
            ))}
          </ul>
        </section>

        <section ref={mainRef}>
          <div className="text text_type_main-small">Начинки</div>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.main.map((ingredient) => (
              <li key={ingredient._id}>
                <IngredientCard ingredient={ingredient} />
              </li>
            ))}
          </ul>
        </section>

        <section ref={sauceRef}>
          <div className="text text_type_main-small">Соусы</div>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.sauce.map((ingredient) => (
              <li key={ingredient._id}>
                <IngredientCard ingredient={ingredient} />
              </li>
            ))}
          </ul>
        </section>
      </section>
    </section>
  );
};
