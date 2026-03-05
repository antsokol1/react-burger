import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const bun = {
    _id: '60666c42cc7b410027a1a9b1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0,
  };

  console.log(bun);

  const someIngredientsIds = [
    '60666c42cc7b410027a1a9b9',
    '60666c42cc7b410027a1a9b4',
    '60666c42cc7b410027a1a9bc',
    '60666c42cc7b410027a1a9bb',
    '60666c42cc7b410027a1a9bb',
  ];

  const customIngredients = ingredients.filter((ingredient) =>
    someIngredientsIds.includes(ingredient._id)
  );

  console.log(customIngredients);

  return (
    <section className={styles.burger_constructor}>
      <section>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={200}
          text="Краторная булка N-200i (верх)"
          thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
          type="top"
        />
      </section>

      <section>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={200}
          text="Краторная булка N-200i (верх)"
          thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
          type="top"
        />
      </section>

      <section>
        <ConstructorElement
          handleClose={undefined}
          isLocked
          price={200}
          text="Краторная булка N-200i (верх)"
          thumbnail="https://react-burger-ui-components.education-services.ru/assets/img-CFqVEZmj.png"
          type="top"
        />
      </section>
    </section>
  );
};
