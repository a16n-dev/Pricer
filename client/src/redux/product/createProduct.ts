import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Product, ProductData } from '../../models/Product';
import { ProductState } from './ProductSlice';

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: ProductData, thunkAPI): Promise<Product> => {
  
    const product = await ApiClient.createProduct(productData);
    return product;
  },
);

export const createProductReducers = (builder: ActionReducerMapBuilder<ProductState>) => {
  builder.addCase(createProduct.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(createProduct.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.products[payload.id] = payload;
    state.count = Object.keys(state.products).length;
  });
  
  builder.addCase(createProduct.rejected, (state, action) => {
    state.loading = false;
  });
};