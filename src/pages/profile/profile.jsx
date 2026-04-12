import { useDispatch } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

import { useLogoutMutation } from '@/components/services/user/api';
import { clearUser } from '@/components/services/user/userSlice';

import styles from './profile.module.css';

export const Profile = () => {
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  async function handleClick() {
    try {
      const result = await logout();
      if (result) {
        dispatch(clearUser());
        // navigate('/');
      }
    } catch (error) {
      console.log('Ошибка выхода:', error);
    }
  }

  return (
    <section className={styles.container}>
      <section className={`${styles.first_item} text text_type_main-default`}>
        <NavLink
          to="/profile"
          end
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          Профиль
        </NavLink>
        <NavLink
          to="/profile/orders"
          className={({ isActive }) => (isActive ? styles.active : styles.link)}
        >
          История заказов
        </NavLink>
        <NavLink to="/" className={styles.link} onClick={handleClick}>
          Выход
        </NavLink>
        <section className={styles.section_p}>
          <p className={`${styles.custom_p} text text_type_main-small`}>
            В этом разделе вы можете
          </p>
          <p className={`${styles.custom_p} text text_type_main-small`}>
            изменить свои персональные данные
          </p>
        </section>
      </section>
      <section className={styles.second_item}>
        <Outlet />
      </section>
    </section>
  );
};
