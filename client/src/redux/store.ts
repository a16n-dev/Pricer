import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import AuthSlice from './AuthSlice';
import ProductSlice from './ProductSlice';

const store = configureStore({
  reducer: {
    products: ProductSlice,
    auth: AuthSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;