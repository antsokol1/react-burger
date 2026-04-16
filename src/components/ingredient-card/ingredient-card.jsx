import { CurrencyIcon, Counter } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';

import { selectCount } from '../services/ingredients/burgerSlice';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient }) => {
  const countMap = useSelector(selectCount);

  console.log(countMap);

  const counter = countMap[ingredient._id] || 0;

  const type = ingredient.type === 'bun' ? 'bun' : 'ingredient';

  const [{ isDragging }, dragRef] = useDrag({
    type: type,
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <article
      ref={dragRef}
      className={`${styles.ingredient_card} ${isDragging ? styles.dragging : ''}`}
    >
      {counter > 0 && <Counter count={counter} size="default" />}
      <img src={ingredient.image} alt={ingredient.name} />
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
