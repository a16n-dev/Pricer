import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Recipe, RecipeData } from '../../models/Recipe';
import RecipeState from './recipeState';

export const createRecipe = createAsyncThunk(
  'recipes/create',
  async (recipeData: RecipeData, thunkAPI): Promise<Recipe> => {
  
    const recipe = await ApiClient.createRecipe(recipeData);
    return recipe;
  },
);

export const createRecipeReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {
  builder.addCase(createRecipe.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(createRecipe.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.recipes[payload.id] = payload;
    state.count = Object.keys(state.recipes).length;
  });
  
  builder.addCase(createRecipe.rejected, (state, action) => {
    state.loading = false;
  });
};