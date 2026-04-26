import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { useLoginMutation } from '@/components/services/user/api';
import { setUser } from '@/components/services/user/userSlice';

import type { AppDispatch } from '@/components/services/store';

import styles from './login.module.css';

type UserData = {
  email: string;
  password: string;
};

export const Login = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();

  const [userData, setUserData] = useState<UserData>({
    email: '',
    password: '',
  });

  const [login, { isLoading }] = useLoginMutation();

  function handleChange(field: string, value: string): void {
    setUserData({
      ...userData,
      [field]: value,
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    try {
      const result = await login(userData).unwrap();
      if (result) {
        dispatch(setUser(result));
      }
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  }

  return (
    <section className={styles.container}>
      <form className={styles.first_item} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Вход</h1>
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
        <Button size="large" type="primary" htmlType="submit" disabled={isLoading}>
          Войти
        </Button>
      </form>
      <section className={styles.second_item}>
        <p className="text text_type_main-small">Вы - новый пользователь?</p>
        <Link to="/registration" className={`${styles.link} text text_type_main-small`}>
          {' '}
          Зарегистрироваться
        </Link>
      </section>
      <section className={styles.second_item}>
        <p className="text text_type_main-small">Забыли пароль?</p>
        <Link
          to="/forgot-password"
          className={`${styles.link} text text_type_main-small`}
        >
          {' '}
          Восстановить пароль
        </Link>
      </section>
    </section>
  );
};
