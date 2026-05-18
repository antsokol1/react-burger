import { CurrencyIcon, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';

import { useGetIngredientsQuery } from '@/components/services/ingredients/api';
import { useGetProfileOrdersQuery } from '@/components/services/orders/api';
import { selectOrder } from '@/components/services/orders/selectedOrderSlice';

import type { AppDispatch } from '@/components/services/store';

import styles from './profile-orders.module.css';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { isLoading: isLoadingOrders, data: ordersResponse } =
    useGetProfileOrdersQuery();
  const { isLoading: isLoadingIngredients, data: ingredientsData } =
    useGetIngredientsQuery();
  const ingredients = ingredientsData ? ingredientsData : [];
  const orders = ordersResponse?.orders || [];

  const location = useLocation();

  if (isLoadingOrders || isLoadingIngredients) {
    return <Preloader />;
  }

  return (
    <section className={styles.container}>
      <h2 className="text text_type_main-medium">История заказов</h2>

      <div className={`${styles.feed} custom-scroll`}>
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/profile/orders/${order._id}`}
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <section className={styles.ingredient_list}>
                  {order.ingredients?.map((ingredient, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className={styles.ingredient_icon}
                      style={{
                        zIndex: 6 - index,
                        transform: `translateX(-${index * 16}px)`,
                      }}
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
                      const ingredient = ingredients.find((i) => i._id === ingredientId);
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
    </section>
  );
};
