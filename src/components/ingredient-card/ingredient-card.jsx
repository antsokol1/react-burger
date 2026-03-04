import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient }) => {
  return (
    <article className={styles.ingredient_card}>
      <Counter count={100} size="default" />
      <img src={ingredient.image} />
      <div className={styles.price}>
        <span className="text text_type_digits-default">{ingredient.price}</span>
        <CurrencyIcon type="primary" />
      </div>
      <div className={styles.price}>
        <span className="text text_type_main-default">{ingredient.name}</span>
      </div>
    </article>
  );
};
