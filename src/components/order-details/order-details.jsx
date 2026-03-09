import { Modal } from '@/components/modal/modal';

import styles from './order-details.module.css';

export function OrderDetails({ title, onClose }) {
  const order = '034536';

  return (
    <Modal title={title} onClose={onClose}>
      <section className={styles.order_details}>
        <p className={`${styles.order} text text_type_digits-large`}>{order}</p>
        <p className="text text_type_main-default">идентификатор заказа</p>
        <img src="../src/assets/images/done.png" className={styles.check_image} />
        <p className="text text_type_main-default">Ваш заказ начали готовить</p>
        <p className={`${styles.description_add} text text_type_main-default`}>
          Дождитесь готовности на орбитальной станции
        </p>
      </section>
    </Modal>
  );
}
