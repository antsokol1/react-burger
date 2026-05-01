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

import type { AppDispatch } from '@/components/services/store';

import styles from './profile-form.module.css';

type UserData = {
  name: string;
  email: string;
  password: string;
};

export const ProfileForm = (): React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(selectUser);

  const [userData, setUserData] = useState<UserData>({
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
    currentUser &&
    (userData.name !== currentUser.name ||
      userData.email !== currentUser.email ||
      userData.password !== '');

  function handleChange(field: string, value: string): void {
    setUserData({
      ...userData,
      [field]: value,
    });
  }

  function handleCancel(): void {
    if (currentUser) {
      setUserData({
        name: currentUser.name,
        email: currentUser.email,
        password: '',
      });
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
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
    <form onSubmit={handleSubmit} className={styles.container}>
      <Input
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
        icon="EditIcon"
        name="password"
        onChange={(event) => handleChange('password', event.target.value)}
        placeholder="Пароль"
        value={userData.password}
      />

      {isEdited && (
        <section className={styles.button_container}>
          <Button type="secondary" htmlType="button" onClick={handleCancel}>
            Отменить
          </Button>
          <Button htmlType="submit">Сохранить</Button>
        </section>
      )}
    </form>
  );
};
