import {
  Input,
  EmailInput,
  PasswordInput,
  Button,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useUpdateUserMutation } from '@/components/services/user/api';
import { selectUser, setUser } from '@/components/services/user/userSlice';

import styles from './profile-form.module.css';

export const ProfileForm = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [updateUser] = useUpdateUserMutation();

  useEffect(() => {
    if (currentUser) {
      setUserData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
      });
    }
  }, [currentUser]);

  const isEdited =
    userData.name !== currentUser.name ||
    userData.email !== currentUser.email ||
    userData.password !== '';

  function handleChange(field, value) {
    setUserData({
      ...userData,
      [field]: value,
    });
  }

  function handleCancel() {
    if (currentUser) {
      setUserData({
        name: currentUser.name,
        email: currentUser.email,
        password: '',
      });
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await updateUser(userData).unwrap();
      if (result) {
        dispatch(setUser(result));
      }
    } catch (error) {
      console.log('Ошибка редактирования пользователя', error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        isIcon
        icon="EditIcon"
        name="name"
        onChange={(event) => handleChange('name', event.target.value)}
        placeholder="Имя"
        value={userData.name}
      />
      <EmailInput
        isIcon
        name="email"
        onChange={(event) => handleChange('email', event.target.value)}
        placeholder="Логин"
        value={userData.email}
      />
      <PasswordInput
        isIcon
        icon="EditIcon"
        name="password"
        onChange={(event) => handleChange('password', event.target.value)}
        placeholder="Пароль"
        value={userData.password}
      />

      {isEdited && (
        <section className={styles.button_container}>
          <Button type="secondary" onClick={handleCancel}>
            Отменить
          </Button>
          <Button htmlType="submit">Сохранить</Button>
        </section>
      )}
    </form>
  );
};
