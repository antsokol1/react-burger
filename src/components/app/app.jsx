import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { ingredients } from '@utils/ingredients';

import styles from './app.module.css';

export const App = () => {
  // const [isLoading, setLoading] = useState(false);
  // const [newIngredients, setIngredients] = useState(null);

  // useEffect(() => {
  //   console.log('7. useEffect ВЫЗВАН!');
  //   async function fetchData() {
  //     try {
  //       setLoading(true);
  //       const data = await getIngredients();
  //       setIngredients(data);
  //     } catch (err) {
  //       console.error('Ошибка загрузки:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData();

  // }, []);

  // console.log('new_ingredients',newIngredients)

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor ingredients={ingredients} />
      </main>
      <div id="react-modals"></div>
    </div>
  );
};
