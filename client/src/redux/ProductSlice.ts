import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Product } from '../models/models';
import { v4 as uuidv4 } from 'uuid';


export type ProductState = {
    count: number;
    loading: boolean;
    products: {[key: string]: Product};
}

interface CreateProductData {
    name: string;
    brand?: string;
    description?: string;
    cost: number;
    quantity: number;
    units: string;
}

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: CreateProductData, thunkAPI): Promise<Product> => {

    /**
     * This is eventually where the api call will live
     */
    
    // Do validation here
    const product: Product = {
      id: uuidv4(),
      dateCreated: new Date(),
      dateModified: new Date(),
      ...productData,
    };

    console.log(product);

    return product;


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
  },
});
  
// Extract the action creators object and the reducer
const { actions, reducer } = ProductSlice;

// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;

// Export the reducer, either as a default or named export
export default reducer;