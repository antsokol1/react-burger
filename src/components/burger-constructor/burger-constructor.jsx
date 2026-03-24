import {
  ConstructorElement,
  CurrencyIcon,
  Button,
  Preloader,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { Modal } from '@/components/modal/modal';
import { OrderDetails } from '@/components/order-details/order-details';

import { useGetIngredientsQuery } from '../services/ingredients/api';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const { isLoading, data: ingredients } = useGetIngredientsQuery();
  const [isOrderDetails, setOrderDetails] = useState(false);

  if (isLoading || !ingredients) {
    return (
      <section className={styles.burger_constructor}>
        <p className="text text_type_main-medium mb-6">Корзина</p>
        <Preloader />
      </section>
    );
  }

  const bun = {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  };

  const someIngredients = ingredients.filter((item) => item.type !== 'bun');

  function handleCreate() {
    setOrderDetails(true);
  }

  return (
    <section className={styles.burger_constructor}>
      <section className={styles.bun_top}>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={bun.price}
          text={bun.name}
          thumbnail={bun.image}
          type="top"
        />
      </section>

      <section className={`${styles.scrollable_elements} custom-scroll`}>
        {someIngredients.map((ingredient) => (
          <section key={ingredient._id} className={styles.constructor_element}>
            <DragIcon className={styles.drag_icon} />
            <ConstructorElement
              handleClose={undefined}
              isLocked={false}
              price={ingredient.price}
              text={ingredient.name}
              thumbnail={ingredient.image}
            />
          </section>
        ))}
      </section>

      <section className={styles.bun_bottom}>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={bun.price}
          text={bun.name}
          thumbnail={bun.image}
          type="bottom"
        />
      </section>
      <section className={styles.button_group}>
        <p className={`${styles.button_group_price} text text_type_digits-medium`}>
          1000
        </p>
        <CurrencyIcon type="primary" className={styles.button_group_icon} />
        <Button onClick={handleCreate} size="large" type="primary">
          Оформить заказ
        </Button>

        {isOrderDetails && (
          <Modal title={'Заказ оформлен'} onClose={() => setOrderDetails(false)}>
            <OrderDetails order={'034536'} />
          </Modal>
        )}
      </section>
    </section>
  );
};
