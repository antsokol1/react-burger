import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../services/hooks';
import { useGetIngredientsQuery } from '../services/ingredients/api';
import { useGetOrdersQuery, useGetOrdersByIdQuery } from '../services/orders/api';

import type { Ingredient } from '../services/ingredients/api';

import styles from './feed-details.module.css';

export function FeedDetails(): React.JSX.Element {
  const { id } = useParams();

  const { isLoading: isLoadingIngredients, data: ingredientsData } =
    useGetIngredientsQuery();
  const ingredients = ingredientsData ? ingredientsData : [];

  // заказ из Redux
  const reduxOrder = useAppSelector((state) => state.selectedOrder?.order);

  // если нет в Redux
  const { data: ordersResponse, isLoading: isLoadingOrders } = useGetOrdersQuery();
  const orders = ordersResponse?.orders || [];
  const wsOrder = orders.find((item) => item._id === id);

  // Если заказа нет в WebSocket, делаем HTTP запрос
  const shouldFetchById = !reduxOrder && !wsOrder && id;
  const {
    data: httpOrder,
    isLoading: isLoadingHttpOrder,
    isError,
  } = useGetOrdersByIdQuery(id!, {
    skip: !shouldFetchById,
  });

  const order = reduxOrder || wsOrder || httpOrder;

  const isLoading =
    isLoadingIngredients ||
    (isLoadingOrders && !reduxOrder) ||
    (shouldFetchById && isLoadingHttpOrder);

  if (isLoading) {
    return <Preloader />;
  }

  if (!order || isError) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-medium">Заказ не найден</p>
      </div>
    );
  }

  type UniqueIngredient = {
    ingredient: Ingredient;
    count: number;
  };

  const getUniqueIngredients = (): UniqueIngredient[] => {
    if (!order.ingredients) return [];

    const counts: Record<string, number> = {};
    order.ingredients.forEach((ingredientId) => {
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
      <div className={styles.number}>
        <p className="text text_type_digits-default">#</p>
        <p className="text text_type_digits-default">{order.number}</p>
      </div>

      <p className="text text_type_main-medium">{order.name || 'Космический бургер'}</p>

      <p
        className={`text text_type_main-small ${getStatusColor(order.status)} ${styles.status}`}
      >
        {getStatusText(order.status)}
      </p>

      <p className="text text_type_main-medium">Состав:</p>

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
