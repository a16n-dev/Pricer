import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Product } from '../../models/Product';
import ProductState from './productState';

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (): Promise<Array<Product>> => {
    const products = await ApiClient.getProducts();
    return products;
  },
);

export const fetchProductsReducers = (builder: ActionReducerMapBuilder<ProductState>) => {

  builder.addCase(fetchProducts.fulfilled, (state, {payload}) => {
    state.products = (new Array(...payload)).reduce((map: any, p) => {
      map[p.id] = p;
      return map;
    }, {});
    state.count = Object.keys(state.products).length;
  });
};