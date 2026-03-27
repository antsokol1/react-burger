import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  Preloader,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef } from 'react';
import { useDrop, useDrag } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '@/components/modal/modal';
import { OrderDetails } from '@/components/order-details/order-details';

import {
  useGetIngredientsQuery,
  useCreateOrderMutation,
} from '../services/ingredients/api';
import {
  addIngredient,
  deleteIngredient,
  addBun,
  moveIngredient,
  selectPrice,
} from '../services/ingredients/burgerSlice';

import styles from './burger-constructor.module.css';

// Компонент для перетаскиваемого ингредиента
const DraggableIngredient = ({ ingredient, index, dispatch }) => {
  const sectionRef = useRef(null);

  const [{ isDragging }, moveRef] = useDrag({
    type: 'move',
    item: { customId: ingredient.customId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'move',
    hover: (item, monitor) => {
      if (!sectionRef.current) return;
      if (item.customId === ingredient.customId) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = sectionRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dispatch(moveIngredient({ dragId: item.customId, hoverId: ingredient.customId }));
      item.index = hoverIndex;
    },
  });

  drop(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={styles.constructor_element}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon className={styles.drag_icon} />
      <section ref={moveRef}>
        <ConstructorElement
          price={ingredient.price}
          text={ingredient.name}
          thumbnail={ingredient.image}
          handleClose={() => dispatch(deleteIngredient(ingredient.customId))}
        />
      </section>
    </section>
  );
};

export const BurgerConstructor = () => {
  const dispatch = useDispatch();

  const { isLoading, data: ingredients } = useGetIngredientsQuery();
  const [createOrder, { data: orderData }] = useCreateOrderMutation();

  const bun = useSelector((state) => state.burger.bun);
  const burgerIngredients = useSelector((state) => state.burger.ingredients);

  const [isOrderDetails, setOrderDetails] = useState(false);

  const totalPrice = useSelector(selectPrice);

  const [{ isBunOver }, bunRef] = useDrop({
    accept: 'bun',
    drop: (item) => {
      dispatch(addBun(item.ingredient));
    },
    collect: (monitor) => ({
      isBunOver: monitor.isOver(),
    }),
  });

  const [{ isIngredientOver }, ingredientRef] = useDrop({
    accept: 'ingredient',
    drop: (item) => {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor) => ({
      isIngredientOver: monitor.isOver(),
    }),
  });

  if (isLoading || !ingredients) {
    return (
      <section className={styles.burger_constructor}>
        <p className="text text_type_main-medium mb-6">Корзина</p>
        <Preloader />
      </section>
    );
  }

  const orderIngredients = bun
    ? [bun._id, ...burgerIngredients.map((item) => item._id), bun._id]
    : [];

  // const bun = ingredients.find(item => item.type === 'bun');

  // const someIngredients = ingredients.filter(item => item.type !== 'bun');

  // const orderIngredients = [bun._id, ...someIngredients.map(item => item._id), bun._id];

  async function handleCreate() {
    const result = await createOrder(orderIngredients);
    if (result) {
      setOrderDetails(true);
    }
  }

  if (orderIngredients.length === 0) {
    return (
      <section className={styles.burger_constructor}>
        <section
          ref={bunRef}
          className={`${styles.bun_top} ${styles.empty_bun} ${isBunOver ? styles.bun_over : ''}`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </section>
        <section
          ref={ingredientRef}
          className={`${styles.scrollable_elements}  custom-scroll`}
        >
          <section
            className={`${styles.empty_ingredient} ${styles.constructor_element} ${isIngredientOver ? styles.ingredient_over : ''}`}
          >
            <p className="text text_type_main-default text_color_inactive">
              Выберите начинку
            </p>
          </section>
        </section>
        <section
          className={`${styles.empty_bun} ${styles.bun_top} ${isBunOver ? styles.bun_over : ''}`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </section>
        <section className={styles.button_group}>
          <p className={`${styles.button_group_price} text text_type_digits-medium`}>
            0
          </p>
          <CurrencyIcon type="primary" className={styles.button_group_icon} />
          <Button size="large" type="primary">
            Оформить заказ
          </Button>
        </section>
      </section>
    );
  }

  return (
    <section className={styles.burger_constructor}>
      <section
        ref={bunRef}
        className={`${styles.bun_top} ${isBunOver ? styles.bun_over : ''}`}
      >
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={bun.price}
          text={bun.name + '\n(верх)'}
          thumbnail={bun.image}
          type="top"
        />
      </section>

      <section
        ref={ingredientRef}
        className={`${styles.scrollable_elements}  custom-scroll`}
      >
        {burgerIngredients.length === 0 ? (
          <section
            className={`${styles.empty_ingredient} ${styles.constructor_element} ${isIngredientOver ? styles.ingredient_over : ''}`}
          >
            <p className="text text_type_main-default text_color_inactive">
              Выберите начинку
            </p>
          </section>
        ) : (
          burgerIngredients.map((ingredient, index) => (
            <DraggableIngredient
              key={ingredient.customId}
              ingredient={ingredient}
              index={index}
              dispatch={dispatch}
            />
          ))
        )}
      </section>

      <section className={`${styles.bun_bottom} ${isBunOver ? styles.bun_over : ''}`}>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={bun.price}
          text={bun.name + '\n(низ)'}
          thumbnail={bun.image}
          type="bottom"
        />
      </section>
      <section className={styles.button_group}>
        <p className={`${styles.button_group_price} text text_type_digits-medium`}>
          {totalPrice}
        </p>
        <CurrencyIcon type="primary" className={styles.button_group_icon} />
        <Button onClick={handleCreate} size="large" type="primary">
          Оформить заказ
        </Button>

        {isOrderDetails && (
          <Modal title={'Заказ оформлен'} onClose={() => setOrderDetails(false)}>
            <OrderDetails orderData={orderData} />
          </Modal>
        )}
      </section>
    </section>
  );
};
