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
// import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
// import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
// import { ingredients } from '@utils/ingredients';
// import { getIngredients } from '@utils/api';
import { Registration } from '@/pages/registration/registration';
import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route';

import { ProfileForm } from '../../pages/profile-form/profile-form';
import { checkUserAuth } from '../services/user/userSlice';

import styles from './app.module.css';

export const App = () => {
  // const [isLoading, setLoading] = useState(false);
  // const [ingredients, setIngredients] = useState(null);

  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       setLoading(true);
  //       const data = await getIngredients();
  //       setIngredients(data);
  //     } catch (e) {
  //       console.error('Ошибка загрузки:', e);
  //     } finally {
  //       setLoading(false);
  //     }
  //   }

  //   fetchData();
  // }, []);

  const location = useLocation();
  const isModal = location.state?.isModal;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
  }, []);

  return (
    <div className={styles.app}>
      <AppHeader />
      <main className={styles.main}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/ingredient/:id"
            element={isModal ? <Home /> : <IngredientPage />}
          />
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
      </main>
    </div>
  );
};
