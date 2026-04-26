import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route, useLocation } from 'react-router-dom';

import { Feed } from '@/pages/feed/feed';
import { Forgot, Reset } from '@/pages/forgot/forgot';
import { Home } from '@/pages/home/home';
import { IngredientPage } from '@/pages/ingredient-page/ingredient-page';
import { Login } from '@/pages/login/login';
import { NotFound } from '@/pages/not-found/not-found';
import { ProfileOrder } from '@/pages/profile-order/profile-order';
import { Profile } from '@/pages/profile/profile';
import { Registration } from '@/pages/registration/registration';
import { AppHeader } from '@components/app-header/app-header';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { ProtectedRoute } from '@components/protected-route';

import { ProfileForm } from '../../pages/profile-form/profile-form';
import { checkUserAuth } from '../services/user/userSlice';

import type { AppDispatch } from '../services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        {/* Основные маршруты */}
        <Routes location={backgroundLocation || location}>
          <Route path="/" element={<Home />} />
          <Route path="/ingredient/:id" element={<IngredientPage />} />
          <Route path="/feed" element={<Feed />} />

          <Route
            path="/login"
            element={<ProtectedRoute onlyUnAuth component={<Login />} />}
          />
          <Route
            path="/registration"
            element={<ProtectedRoute onlyUnAuth component={<Registration />} />}
          />
          <Route
            path="/forgot-password"
            element={<ProtectedRoute onlyUnAuth component={<Forgot />} />}
          />
          <Route
            path="/reset-password"
            element={<ProtectedRoute onlyUnAuth component={<Reset />} />}
          />

          <Route path="/profile" element={<ProtectedRoute component={<Profile />} />}>
            <Route index element={<ProfileForm />} />
            <Route path="orders" element={<ProfileOrder />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>

        {/* Модальные окна поверх */}
        {backgroundLocation && (
          <Routes>
            <Route
              path="/ingredient/:id"
              element={
                <Modal title="Детали ингредиента" onClose={() => window.history.back()}>
                  <IngredientDetails />
                </Modal>
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
};
