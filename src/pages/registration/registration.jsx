import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '@/components/services/user/api';
import { setUser } from '@/components/services/user/userSlice';

import styles from './registration.module.css';

export const Registration = () => {
  const dispatch = useDispatch();

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [register, { isLoading }] = useRegisterMutation();

  function handleChange(field, value) {
    setUserData({
      ...userData,
      [field]: value,
    });
  }

  async function handleClick(event) {
    event.preventDefault();
    try {
      const result = await register(userData);
      if (result) {
        dispatch(setUser(result));
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  }

  return (
    <section className={styles.container}>
      <section className={styles.first_item}>
        <h1 className="text text_type_main-medium">Регистрация</h1>
        <Input
          placeholder="Имя"
          size="default"
          type="text"
          value={userData?.name || ''}
          onChange={(event) => handleChange('name', event.target.value)}
        />
        <Input
          placeholder="Email"
          size="default"
          type="email"
          value={userData?.email || ''}
          onChange={(event) => handleChange('email', event.target.value)}
        />
        <Input
          icon="ShowIcon"
          placeholder="Пароль"
          size="default"
          type="password"
          value={userData?.password || ''}
          onChange={(event) => handleChange('password', event.target.value)}
        />
        <Button size="large" type="primary" onClick={handleClick} disabled={isLoading}>
          Зарегистрироваться
        </Button>
      </section>
      <section className={styles.second_item}>
        <p className="text text_type_main-small">Уже зарегистрированы?</p>
        <Link to="/login" className={`${styles.link} text text_type_main-small`}>
          {' '}
          Войти
        </Link>
      </section>
    </section>
  );
};
