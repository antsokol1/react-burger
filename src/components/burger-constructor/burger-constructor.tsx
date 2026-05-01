import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  Preloader,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useRef } from 'react';
import { useDrop, useDrag, type DropTargetMonitor } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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
  clearConstructor,
} from '../services/ingredients/burgerSlice';

import type { Ingredient } from '../services/ingredients/api';
import type { ConstructorIngredient } from '../services/ingredients/burgerSlice';
import type { AppDispatch, RootState } from '../services/store';

import styles from './burger-constructor.module.css';

type DraggableIngredientProps = {
  ingredient: ConstructorIngredient;
  index: number;
  dispatch: AppDispatch;
};

type DragItem = {
  customId: string;
  index: number;
};

type DropItem = {
  ingredient: Ingredient;
};

// Компонент для перетаскиваемого ингредиента
const DraggableIngredient = ({
  ingredient,
  index,
  dispatch,
}: DraggableIngredientProps): React.JSX.Element => {
  const sectionRef = useRef<HTMLElement>(null);

  const [{ isDragging }, moveRef] = useDrag<DragItem, unknown, { isDragging: boolean }>({
    type: 'move',
    item: { customId: ingredient.customId, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragItem, unknown, unknown>({
    accept: 'move',
    hover: (item: DragItem, monitor: DropTargetMonitor) => {
      if (!sectionRef.current) return;
      if (item.customId === ingredient.customId) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = sectionRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      dispatch(moveIngredient({ dragId: item.customId, hoverId: ingredient.customId }));
      item.index = hoverIndex;
    },
  });

  drop(sectionRef);
  moveRef(sectionRef);

  return (
    <section
      ref={sectionRef}
      className={styles.constructor_element}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <DragIcon type="primary" className={styles.drag_icon} />
      <ConstructorElement
        price={ingredient.price}
        text={ingredient.name}
        thumbnail={ingredient.image}
        handleClose={() => dispatch(deleteIngredient(ingredient.customId))}
      />
    </section>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, data: ingredientsData } = useGetIngredientsQuery();
  const ingredients = ingredientsData || [];
  const [createOrder, { data: orderData, isLoading: isOrderLoading }] =
    useCreateOrderMutation();

  const bun = useSelector((state: RootState) => state.burger.bun);
  const burgerIngredients = useSelector((state: RootState) => state.burger.ingredients);

  const [isOrderDetails, setOrderDetails] = useState(false);

  const totalPrice = useSelector(selectPrice);

  const [{ isBunOver }, bunRef] = useDrop<DropItem, unknown, { isBunOver: boolean }>({
    accept: 'bun',
    drop: (item: DropItem) => {
      dispatch(addBun(item.ingredient));
    },
    collect: (monitor) => ({
      isBunOver: monitor.isOver(),
    }),
  });

  const [{ isIngredientOver }, ingredientRef] = useDrop<
    DropItem,
    unknown,
    { isIngredientOver: boolean }
  >({
    accept: 'ingredient',
    drop: (item: DropItem) => {
      dispatch(addIngredient(item.ingredient));
    },
    collect: (monitor) => ({
      isIngredientOver: monitor.isOver(),
    }),
  });

  if (isLoading || !ingredients.length) {
    return (
      <section className={styles.burger_constructor}>
        <p className="text text_type_main-medium mb-6">Корзина</p>
        <Preloader />
      </section>
    );
  }

  const orderIngredients = bun
    ? [
        bun._id,
        ...burgerIngredients.map((item: ConstructorIngredient) => item._id),
        bun._id,
      ]
    : [];

  async function handleCreate(): Promise<void> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    try {
      const result = await createOrder(orderIngredients).unwrap();
      if (result) {
        setOrderDetails(true);
      }
    } catch (error) {
      console.error('Ошибка создания заказа:', error);
    }
  }

  function handleClose(): void {
    setOrderDetails(false);
    dispatch(clearConstructor());
  }

  if (orderIngredients.length === 0) {
    return (
      <section className={styles.burger_constructor}>
        <section
          ref={bunRef as unknown as React.Ref<HTMLElement>}
          className={`${styles.bun_top} ${styles.empty_bun} ${isBunOver ? styles.bun_over : ''}`}
        >
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </section>
        <section
          ref={ingredientRef as unknown as React.Ref<HTMLElement>}
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
          <Button htmlType="submit" size="large" type="primary" disabled>
            Оформить заказ
          </Button>
        </section>
      </section>
    );
  }

  if (!bun) {
    return <Preloader />;
  }

  return (
    <section className={styles.burger_constructor}>
      <section
        ref={bunRef as unknown as React.Ref<HTMLElement>}
        className={`${styles.bun_top} ${isBunOver ? styles.bun_over : ''}`}
      >
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={bun.price}
          text={`${bun.name} (верх)`}
          thumbnail={bun.image}
          type="top"
        />
      </section>

      <section
        ref={ingredientRef as unknown as React.Ref<HTMLElement>}
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
          burgerIngredients.map((ingredient: ConstructorIngredient, index: number) => (
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
          text={`${bun.name} (низ)`}
          thumbnail={bun.image}
          type="bottom"
        />
      </section>

      <section className={styles.button_group}>
        <p className={`${styles.button_group_price} text text_type_digits-medium`}>
          {totalPrice}
        </p>
        <CurrencyIcon type="primary" className={styles.button_group_icon} />
        <Button htmlType="submit" onClick={handleCreate} size="large" type="primary">
          Оформить заказ
        </Button>

        {isOrderDetails && (
          <Modal title="Заказ оформлен" onClose={handleClose}>
            {isOrderLoading ? (
              <Preloader />
            ) : (
              orderData && <OrderDetails orderData={orderData} />
            )}
          </Modal>
        )}
      </section>
    </section>
  );
};
