import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Tagged } from '../../models/Common';
import { Product, ProductData } from '../../models/Product';
import ProductState from './productState';

export const updateProduct = createAsyncThunk(
  'products/update',
  async (productData: Tagged<ProductData>, thunkAPI): Promise<Product> => {
  
    const product = await ApiClient.updateProduct(productData);
    return product;
  },
);

export const updateProductReducers = (builder: ActionReducerMapBuilder<ProductState>) => {
  builder.addCase(updateProduct.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(updateProduct.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.products[payload.id] = payload;
    state.count = Object.keys(state.products).length;
  });
  
  builder.addCase(updateProduct.rejected, (state, action) => {
    state.loading = false;
  });
};