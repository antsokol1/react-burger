import { Tab, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';

import { IngredientCard } from '@/components/ingredient-card/ingredient-card';

import { useGetIngredientsQuery } from '../services/ingredients/api';
import { selectIngredient } from '../services/ingredients/selectedSlice';

import styles from './burger-ingredients.module.css';

type TabValue = 'bun' | 'main' | 'sauce';

export const BurgerIngredients = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { isLoading, data: ingredients } = useGetIngredientsQuery();

  const [tabValue, setTabValue] = useState<TabValue>('bun');

  const location = useLocation();

  const bunRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const sauceRef = useRef<HTMLElement>(null);

  const refs = {
    bun: bunRef,
    main: mainRef,
    sauce: sauceRef,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const visibleTab = Object.keys(refs).find(
              (key) => refs[key as TabValue].current === entry.target
            ) as TabValue;
            if (visibleTab) {
              setTabValue(visibleTab);
            }
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: `-56px 0px -56px 0px`,
      }
    );

    Object.values(refs).forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return (): void => {
      observer.disconnect();
    };
  }, [ingredients]);

  if (isLoading || !ingredients) {
    return (
      <section className={styles.burger_ingredients}>
        <Preloader />
      </section>
    );
  }

  const groupedIngredients = {
    bun: ingredients.filter((item) => item.type === 'bun'),
    main: ingredients.filter((item) => item.type === 'main'),
    sauce: ingredients.filter((item) => item.type === 'sauce'),
  };

  function handleTab(value: TabValue): void {
    setTabValue(value);
    refs[value].current?.scrollIntoView({ behavior: 'smooth' });
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

      <section className={`${styles.all_ingredients} custom-scroll`}>
        <section ref={bunRef}>
          <p className={`${styles.ingredient_kind} text text_type_main-small`}>Булки</p>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.bun.map((ingredient) => (
              <li key={ingredient._id}>
                <Link
                  to={`/ingredient/${ingredient._id}`}
                  state={{ backgroundLocation: location }}
                  className={styles.link}
                  onClick={() => dispatch(selectIngredient(ingredient))}
                >
                  <IngredientCard ingredient={ingredient} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section ref={mainRef}>
          <p className={`${styles.ingredient_kind} text text_type_main-small`}>
            Начинки
          </p>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.main.map((ingredient) => (
              <li key={ingredient._id}>
                <Link
                  to={`/ingredient/${ingredient._id}`}
                  state={{ backgroundLocation: location }}
                  className={styles.link}
                  onClick={() => dispatch(selectIngredient(ingredient))}
                >
                  <IngredientCard ingredient={ingredient} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section ref={sauceRef}>
          <p className={`${styles.ingredient_kind} text text_type_main-small`}>Соусы</p>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.sauce.map((ingredient) => (
              <li key={ingredient._id}>
                <Link
                  to={`/ingredient/${ingredient._id}`}
                  state={{ backgroundLocation: location }}
                  className={styles.link}
                  onClick={() => dispatch(selectIngredient(ingredient))}
                >
                  <IngredientCard ingredient={ingredient} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </section>
    </section>
  );
};
