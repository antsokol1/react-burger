import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import styles from './ingredient-details.module.css';

export function IngredientDetails() {
  const ingredient = useSelector((state) => state.selected.ingredient);

  if (!ingredient) {
    return <Preloader />;
  }

  return (
    <section className={styles.container}>
      <img src={ingredient.image} className={styles.image} alt={ingredient.name} />
      <p className="text text_type_main-medium">{ingredient.name}</p>
      <section className={styles.food_description}>
        <section className={styles.kind_description}>
          <p className="text text_type_main-default">Калории, ккал</p>
          <p className="text text_type_main-default">{ingredient.calories}</p>
        </section>
        <section className={styles.kind_description}>
          <p className="text text_type_main-default">Белки, г</p>
          <p className="text text_type_main-default">{ingredient.proteins}</p>
        </section>
        <section className={styles.kind_description}>
          <p className="text text_type_main-default">Жиры, г</p>
          <p className="text text_type_main-default">{ingredient.fat}</p>
        </section>
        <section className={styles.kind_description}>
          <p className="text text_type_main-default">Углеводы, г</p>
          <p className="text text_type_main-default">{ingredient.carbohydrates}</p>
        </section>
      </section>
    </section>
  );
}
