import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { FeedDetails } from '@/components/feed-details/feed-details';
import { useAppDispatch } from '@/components/services/hooks';
import { useGetOrdersByIdQuery } from '@/components/services/orders/api';
import { selectOrder } from '@/components/services/orders/selectedOrderSlice';

import styles from './profile-order.module.css';

export const ProfileOrder = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const { id } = useParams();

  const { data: order, isLoading } = useGetOrdersByIdQuery(id!, {
    skip: !id,
  });

  useEffect(() => {
    if (order) {
      dispatch(selectOrder(order));
    }
  }, [order, dispatch]);

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

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
