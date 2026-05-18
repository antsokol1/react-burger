import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { useGetIngredientsQuery } from '../services/ingredients/api';
import { useGetOrdersQuery, useGetOrdersByIdQuery } from '../services/orders/api';

import type { Ingredient } from '../services/ingredients/api';
import type { RootState } from '../services/store';

import styles from './feed-details.module.css';

export function FeedDetails(): React.JSX.Element {
  const { id } = useParams();
  const { isLoading: isLoadingOrders, data: ordersResponse } = useGetOrdersQuery();
  const orders = ordersResponse?.orders || [];

  const { isLoading: isLoadingIngredients, data: ingredientsData } =
    useGetIngredientsQuery();
  const ingredients = ingredientsData ? ingredientsData : [];

  const reduxOrder = useSelector((state: RootState) => state.selectedOrder?.order);
  const apiOrder = orders.find((item) => item._id === id);

  const { data: orderById, isLoading: isLoadingOrderById } = useGetOrdersByIdQuery(id!, {
    skip: !id || !!reduxOrder || !!apiOrder,
  });

  // Определяем финальный заказ
  const order = reduxOrder || apiOrder || orderById;

  // Проверка загрузки
  if (isLoadingOrders || isLoadingIngredients || isLoadingOrderById || !order) {
    return <Preloader />;
  }
  if (isLoadingOrders || isLoadingIngredients || !order) {
    return <Preloader />;
  }

  type UniqueIngredient = {
    ingredient: Ingredient;
    count: number;
  };

  const getUniqueIngredients = (): UniqueIngredient[] => {
    const counts: Record<string, number> = {};
    order.ingredients?.forEach((ingredientId) => {
      counts[ingredientId] = (counts[ingredientId] || 0) + 1;
    });

    return Object.keys(counts)
      .map((ingredientId) => ({
        ingredient: ingredients.find((i) => i._id === ingredientId),
        count: counts[ingredientId],
      }))
      .filter((item): item is UniqueIngredient => !!item.ingredient);
  };

  const uniqueIngredients = getUniqueIngredients();

  const totalPrice =
    order.ingredients?.reduce((sum, ingredientId) => {
      const ingredient = ingredients.find((i) => i._id === ingredientId);
      return sum + (ingredient?.price || 0);
    }, 0) || 0;

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'done':
        return 'Выполнен';
      case 'pending':
        return 'Готовится';
      case 'created':
        return 'Создан';
      case 'cancelled':
        return 'Отменён';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'done':
        return styles.status_done;
      default:
        return '';
    }
  };

  return (
    <section className={styles.container}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        <p className="text text_type_digits-default">#</p>
        <p className="text text_type_digits-default">{order.number}</p>
      </div>

      <p style={{ marginBottom: '10px' }} className="text text_type_main-medium">
        {order.name || 'Космический бургер'}
      </p>

      <p
        style={{ marginBottom: '40px' }}
        className={`text text_type_main-small ${getStatusColor(order.status)}`}
      >
        {getStatusText(order.status)}
      </p>

      <p style={{ marginBottom: '16px' }} className="text text_type_main-medium">
        Состав:
      </p>

      <section className={styles.ingredients_list}>
        {uniqueIngredients.map((item, index) => (
          <section key={index} className={styles.ingredient_item}>
            <section className={styles.ingredient_info}>
              <img
                className={styles.ingredient_image}
                src={item.ingredient?.image}
                alt={item.ingredient?.name}
              />
              <p className="text text_type_main-default">{item.ingredient?.name}</p>
            </section>
            <section className={styles.ingredient_price}>
              <p className="text text_type_digits-default">
                {item.count} x {item.ingredient?.price} ={' '}
                {item.count * (item.ingredient?.price || 0)}
              </p>
              <CurrencyIcon type="primary" />
            </section>
          </section>
        ))}
      </section>

      <section className={styles.footer}>
        <p className={`text text_type_main-small ${styles.card_date}`}>
          {formatDate(order.createdAt)}
        </p>
        <section className={styles.total_price}>
          <p className="text text_type_digits-default">{totalPrice}</p>
          <CurrencyIcon type="primary" />
        </section>
      </section>
    </section>
  );
}
