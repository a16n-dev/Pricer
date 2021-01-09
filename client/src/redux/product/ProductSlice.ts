import {
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import ProductState from './productState';
import { fetchProductsReducers } from './fetchProducts';
import { createProductReducers } from './createProduct';

const ProductSlice = createSlice<ProductState, SliceCaseReducers<ProductState>>({
  name: 'products',
  initialState: {
    count: 0,
    loading: false,
    products: {},
    isHydrated: false,
  },
  reducers: {
   
  },
  extraReducers: builder => {
    fetchProductsReducers(builder);
    createProductReducers(builder);
  },
});
  
// Extract the action creators object and the reducer
const { reducer } = ProductSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;