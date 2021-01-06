import { fetchProducts } from '../redux/product/fetchProducts';
import { fetchRecipes } from '../redux/recipe/fetchRecipes';
import { useAppDispatch } from '../redux/store';
import { fetchUnits } from '../redux/unit/fetchUnits';

const useUserData = () => {
  const dispatch = useAppDispatch();
  return () => {
    dispatch(fetchProducts());
    dispatch(fetchUnits());
    dispatch(fetchRecipes());
  };

};

export default useUserData;