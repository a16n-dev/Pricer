import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ApiClient } from '../api/client';
import { Product, ProductData } from '../models/Product';


export type ProductState = {
    count: number;
    loading: boolean;
    products: {[key: string]: Product};
}

export const createProduct = createAsyncThunk(
  'products/create',
  async (productData: ProductData, thunkAPI): Promise<Product> => {

    const product = await ApiClient.createProduct(productData);
    return product;
  },
);

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (): Promise<Array<Product>> => {

    const products = await ApiClient.getProducts();
    return products;
  },
);

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


    builder.addCase(fetchProducts.fulfilled, (state, {payload}) => {

      state.products = payload.reduce((map: any, p) => {
        map[p.id] = p;
        return map;
      }, {});
      state.count = Object.keys(state.products).length;
    });


  },
});
  
// Extract the action creators object and the reducer
const { actions, reducer } = ProductSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;