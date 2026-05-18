import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FeedDetails } from '@/components/feed-details/feed-details';
import {
  useGetProfileOrdersQuery,
  useGetOrdersByIdQuery,
} from '@/components/services/orders/api';
import { selectOrder } from '@/components/services/orders/selectedOrderSlice';

import type { Order } from '@/components/services/orders/api';
import type { AppDispatch } from '@/components/services/store';

import styles from './profile-order.module.css';

export const ProfileOrder = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, data: ordersResponse } = useGetProfileOrdersQuery();
  const orders: Order[] = ordersResponse?.orders || [];

  const orderFromHistory = orders.find((item) => item._id === id);

  // Если заказа нет в истории, делаем отдельный запрос по ID
  const { data: orderById, isLoading: isLoadingOrderById } = useGetOrdersByIdQuery(id!, {
    skip: !!orderFromHistory || !id,
  });

  useEffect(() => {
    const order = orderFromHistory || orderById;
    if (order) {
      dispatch(selectOrder(order));
    }
  }, [orderFromHistory, orderById, dispatch]);

  if (isLoading || isLoadingOrderById) {
    return <div>Загрузка...</div>;
  }

  const order = orderFromHistory || orderById;

  if (!order) {
    return (
      <section className={styles.container}>
        <h1 className="text text_type_main-large mt-20 mb-5 text-center">
          Заказ не найден
        </h1>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h1 className="text text_type_main-large mt-20 mb-5 text-center">
        Детали заказа #{id}
      </h1>
      <FeedDetails />
    </section>
  );
};
