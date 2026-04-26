import styles from './feed.module.css';

export const Feed = (): React.JSX.Element => {
  return (
    <section className={styles.container}>
      <h2 className="text text_type_main-medium">Лента заказов</h2>
      <p className="text text_type_main-default mt-10">
        Страница находится в разработке
      </p>
    </section>
  );
};
