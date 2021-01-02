import { useEffect } from 'react';
import { fetchProducts } from '../redux/ProductSlice';
import { useAppDispatch } from '../redux/store';
import { fetchUnits } from '../redux/UnitSlice';

const useFetchData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchUnits());
  }, [ dispatch ]);
};

export default useFetchData;