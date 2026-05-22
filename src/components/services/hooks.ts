import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch, RootState } from './store';

// Используйте во всём приложении вместо обычных `useDispatch` и `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
