import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient, onClick }) => {
  return (
    <article className={styles.ingredient_card} onClick={() => onClick(ingredient)}>
      {ingredient.name === 'Краторная булка N-200i' && (
        <Counter count={1} size="default" />
      )}
      <img src={ingredient.image} />
      <div className={styles.price}>
        <p className="text text_type_digits-default">{ingredient.price}</p>
        <CurrencyIcon type="primary" />
      </div>
      <div className={styles.price}>
        <p className="text text_type_main-default">{ingredient.name}</p>
      </div>
    </article>
  );
};
