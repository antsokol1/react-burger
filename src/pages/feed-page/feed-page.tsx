import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { FeedDetails } from '@/components/feed-details/feed-details';
import {
  useGetOrdersQuery,
  useGetOrdersByIdQuery,
} from '@/components/services/orders/api';
import { selectOrder } from '@/components/services/orders/selectedOrderSlice';

import type { Order } from '@/components/services/orders/api';
import type { AppDispatch } from '@/components/services/store';

import styles from './feed-page.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams();
  const { isLoading, data: ordersResponse } = useGetOrdersQuery();
  const orders: Order[] = ordersResponse?.orders || [];

  const orderFromFeed = orders.find((item) => item._id === id);

  // Если заказа нет в ленте
  const { data: orderById } = useGetOrdersByIdQuery(id!, {
    skip: !!orderFromFeed || !id,
  });

  useEffect(() => {
    const order = orderFromFeed || orderById;
    if (order) {
      dispatch(selectOrder(order));
    }
  }, [orderFromFeed, orderById, dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  return (
    <section className={styles.container}>
      <h1 className="text text_type_main-large mt-20 mb-5 text-center">Детали заказа</h1>
      <FeedDetails />
    </section>
  );
};
