import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import AuthSlice from './auth/AuthSlice';
import ProductSlice from './product/ProductSlice';
import RecipeSlice from './recipe/RecipeSlice';
import UnitSlice from './unit/UnitSlice';

const store = configureStore({
  reducer: {
    products: ProductSlice,
    auth: AuthSlice,
    units: UnitSlice,
    recipes: RecipeSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;