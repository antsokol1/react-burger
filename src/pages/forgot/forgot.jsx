import { Input, Button } from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { useForgotMutation, useResetMutation } from '@/components/services/user/api';

import styles from './forgot.module.css';

export const Forgot = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [forgot, { isLoading }] = useForgotMutation();

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await forgot(email);
      if (result) {
        localStorage.setItem('forgotPasswordFlag', 'true');
        navigate('/reset-password');
      }
    } catch (error) {
      console.log('Ошибка сброса пароля', error);
    }
  }

  return (
    <section className={styles.container}>
      <form className={styles.first_item} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <Input
          placeholder="Укажите email"
          size="default"
          s
          type="email"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <Button
          size="large"
          type="primary"
          htmlType="submit"
          disabled={isLoading || !email}
        >
          Восстановить
        </Button>
      </form>
      <section className={styles.second_item}>
        <p className="text text_type_main-small">Вспомнили пароль?</p>
        <Link to="/login" className={`${styles.link} text text_type_main-small`}>
          {' '}
          Войти
        </Link>
      </section>
    </section>
  );
};

export const Reset = () => {
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    token: '',
  });
  const [reset, { isLoading }] = useResetMutation();

  useEffect(() => {
    const forgotPasswordFlag = localStorage.getItem('forgotPasswordFlag');
    if (!forgotPasswordFlag) {
      navigate('/forgot-password');
    }
  }, []);

  const handleChange = (field, value) => {
    setPasswordForm({
      ...passwordForm,
      [field]: value,
    });
  };

  async function handleClick() {
    try {
      const result = await reset(passwordForm.password, passwordForm.token);
      if (result) {
        localStorage.removeItem('forgotPasswordFlag');
        navigate('/login');
      }
    } catch (error) {
      console.log('Ошибка сброса пароля', error);
    }
  }

  return (
    <section className={styles.container}>
      <section className={styles.first_item}>
        <h1 className="text text_type_main-medium">Восстановление пароля</h1>
        <Input
          icon="ShowIcon"
          placeholder="Введите новый пароль"
          size="default"
          s
          type="password"
          value={passwordForm.password}
          onChange={(event) => handleChange('password', event.target.value)}
        />
        <Input
          placeholder="Введите код из письма"
          size="default"
          s
          type="text"
          value={passwordForm.token}
          onChange={(event) => handleChange('token', event.target.value)}
        />
        <Button
          size="large"
          type="primary"
          onClick={handleClick}
          disabled={isLoading || !passwordForm.password || !passwordForm.token}
        >
          Сохранить
        </Button>
      </section>
      <section className={styles.second_item}>
        <p className="text text_type_main-small">Вспомнили пароль?</p>
        <Link to="/login" className={`${styles.link} text text_type_main-small`}>
          {' '}
          Войти
        </Link>
      </section>
    </section>
  );
};
