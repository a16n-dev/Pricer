import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Tagged } from '../../models/Common';
import { RecipeData } from '../../models/Recipe';
import RecipeState from './recipeState';

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async (updates: Tagged<Partial<RecipeData>>, thunkAPI): Promise<Tagged<Partial<RecipeData>>> => {
  
    // const recipe = await ApiClient.createRecipe(recipeData);
    const a = 3;
    return updates;
  },
);

export const updateRecipeReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {
  builder.addCase(updateRecipe.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(updateRecipe.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.recipes[payload.id] = {...state.recipes[payload.id], ...payload.data};
    state.count = Object.keys(state.recipes).length;
  });
  
  builder.addCase(updateRecipe.rejected, (state, action) => {
    state.loading = false;
  });
};