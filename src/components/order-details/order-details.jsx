import styles from './order-details.module.css';

export function OrderDetails({ orderData }) {
  return (
    <section className={styles.order_details}>
      <p className={`${styles.order} text text_type_digits-large`}>
        {orderData.order.number}
      </p>
      <p className="text text_type_main-default">идентификатор заказа</p>
      <img
        src="../src/assets/images/done.png"
        className={styles.check_image}
        alt={'Заказ начали готовить'}
      />
      <p className="text text_type_main-default">Ваш заказ начали готовить</p>
      <p className={`${styles.description_add} text text_type_main-default`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </section>
  );
}
