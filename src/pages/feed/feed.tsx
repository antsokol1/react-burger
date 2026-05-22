import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, Link } from 'react-router-dom';

import { useAppDispatch } from '@/components/services/hooks';
import { useGetIngredientsQuery } from '@/components/services/ingredients/api';
import { useGetOrdersQuery } from '@/components/services/orders/api';
import { selectOrder } from '@/components/services/orders/selectedOrderSlice';

import styles from './feed.module.css';

export const Feed = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { isLoading: isLoadingOrders, data: ordersResponse } = useGetOrdersQuery();
  const { isLoading: isLoadingIngredients, data: ingredientsData } =
    useGetIngredientsQuery();
  const ingredients = ingredientsData ? ingredientsData : [];
  const orders = ordersResponse?.orders || [];

  const location = useLocation();

  if (isLoadingOrders || isLoadingIngredients) {
    return <Preloader />;
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Лента заказов
      </h1>
      <div className={styles.content}>
        <div className={`${styles.feed} custom-scroll`}>
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/feed/${order._id}`}
              state={{ backgroundLocation: location }}
              className={styles.link}
              onClick={() => dispatch(selectOrder(order))}
            >
              <section key={order._id} className={styles.card}>
                <section className={styles.card_header}>
                  <p className="text text_type_digits-default">#{order.number}</p>
                  <p className={`text text_type_main-small ${styles.card_date}`}>
                    {new Date(order.createdAt).toLocaleString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </section>
                <p className="text text_type_main-medium">{order.name}</p>
                <div className={styles.main}>
                  <section className={styles.ingredient_list}>
                    {order.ingredients?.map((ingredient, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className={styles.ingredient_icon}
                      >
                        <img
                          className={styles.ingredient_image}
                          src={
                            ingredients.find((i) => i._id === order.ingredients[index])
                              ?.image
                          }
                          alt={
                            ingredients.find((i) => i._id === order.ingredients[index])
                              ?.name
                          }
                        />
                      </div>
                    ))}
                  </section>
                  <section className={styles.total_price}>
                    <p className="text text_type_digits-medium">
                      {order.ingredients?.reduce((sum, ingredientId) => {
                        const ingredient = ingredients.find(
                          (i) => i._id === ingredientId
                        );
                        return sum + (ingredient?.price || 0);
                      }, 0)}
                    </p>
                    <CurrencyIcon type="primary" className={styles.total_icon} />
                  </section>
                </div>
              </section>
            </Link>
          ))}
        </div>

        <div className={styles.statistics}>
          <div className={styles.orders}>
            <section>
              <p className="text text_type_main-medium mb-2">Готовы:</p>
              <section className={styles.orders_grid_completed}>
                {orders
                  .filter((order) => order.status === 'done')
                  .slice(0, 10)
                  .map((order) => (
                    <p key={order._id} className="text text_type_digits-default">
                      {order.number}
                    </p>
                  ))}
                {orders.filter((order) => order.status === 'done').length === 0 && (
                  <p className="text text_type_main-small text_color_inactive">
                    Нет готовых заказов
                  </p>
                )}
              </section>
            </section>

            <section>
              <p className="text text_type_main-medium mb-2">В работе:</p>
              <section className={styles.orders_grid_running}>
                {orders
                  .filter(
                    (order) => order.status === 'pending' || order.status === 'created'
                  )
                  .slice(0, 10)
                  .map((order) => (
                    <p key={order._id} className="text text_type_digits-default">
                      {order.number}
                    </p>
                  ))}
                {orders.filter(
                  (order) => order.status === 'pending' || order.status === 'created'
                ).length === 0 && (
                  <p className="text text_type_main-small text_color_inactive">
                    Нет заказов в работе
                  </p>
                )}
              </section>
            </section>
          </div>

          <section>
            <p className="text text_type_main-medium">Выполнено за все время:</p>
            <p className={`text text_type_digits-default ${styles.completed}`}>
              {ordersResponse?.total || 0}
            </p>
          </section>

          <section>
            <p className="text text_type_main-medium">Выполнено за сегодня:</p>
            <p className={`text text_type_digits-default ${styles.completed}`}>
              {ordersResponse?.totalToday || 0}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
