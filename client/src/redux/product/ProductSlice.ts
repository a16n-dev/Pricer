import {
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Product } from '../../models/Product';
import { createProductReducers } from './createProduct';
import { fetchProductsReducers } from './fetchProducts';


export type ProductState = {
    count: number;
    loading: boolean;
    products: {[key: string]: Product};
}

const ProductSlice = createSlice<ProductState, SliceCaseReducers<ProductState>>({
  name: 'products',
  initialState: {
    count: 0,
    loading: false,
    products: {},
  },
  reducers: {
   
  },
  extraReducers: builder => {

    // fetchProductsReducers(builder);

    createProductReducers(builder);

    
  },
});
  
// Extract the action creators object and the reducer
const { reducer } = ProductSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;