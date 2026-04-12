import { Tab, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';

import { IngredientCard } from '@/components/ingredient-card/ingredient-card';
// import { IngredientDetails } from '@/components/ingredient-details/ingredient-details';
// import { Modal } from '@/components/modal/modal';

import { useGetIngredientsQuery } from '../services/ingredients/api';
import { selectIngredient } from '../services/ingredients/selectedSlice';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = () => {
  const dispatch = useDispatch();
  const { isLoading, data: ingredients } = useGetIngredientsQuery();

  const [tabValue, setTabValue] = useState('bun');

  // const [selectedIngredient, setSelectedIngredient] = useState(null);
  // const selectedIngredient = useSelector((state) => state.selected.ingredient);

  const navigate = useNavigate();
  const location = useLocation();

  const bunRef = useRef(null);
  const mainRef = useRef(null);
  const sauceRef = useRef(null);

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
              (key) => refs[key].current === entry.target
            );
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

    return () => {
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

  function handleTab(value) {
    setTabValue(value);
    refs[value].current?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleIngredientCard(ingredient) {
    dispatch(selectIngredient(ingredient));
    navigate(`/ingredient/${ingredient._id}`, {
      state: { isModal: true, background: location },
    });
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
                <IngredientCard
                  ingredient={ingredient}
                  onClick={() => handleIngredientCard(ingredient)}
                />
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
                <IngredientCard
                  ingredient={ingredient}
                  onClick={() => handleIngredientCard(ingredient)}
                />
              </li>
            ))}
          </ul>
        </section>

        <section ref={sauceRef}>
          <p className={`${styles.ingredient_kind} text text_type_main-small`}>Соусы</p>
          <ul className={styles.ingredients_grid}>
            {groupedIngredients.sauce.map((ingredient) => (
              <li key={ingredient._id}>
                <IngredientCard
                  ingredient={ingredient}
                  onClick={() => handleIngredientCard(ingredient)}
                />
              </li>
            ))}
          </ul>
        </section>
      </section>

      {/* {selectedIngredient && (
        <Modal title={'Детали ингредиента'} onClose={() => dispatch(clearIngredient())}>
          <IngredientDetails />
        </Modal>
      )} */}
    </section>
  );
};
