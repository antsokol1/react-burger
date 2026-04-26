import styles from './not-found.module.css';

export const NotFound = (): React.JSX.Element => {
  return (
    <section className={styles.container}>
      <h1 className="text text_type_main-medium">404</h1>
      <p className="text text_type_main-default">Такой страницы не существует :( </p>
    </section>
  );
};
