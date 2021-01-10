import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Tagged } from '../../models/Common';
import { RecipeData } from '../../models/Recipe';
import RecipeState from './recipeState';

export const updateRecipe = createAsyncThunk(
  'recipes/update',
  async (updates: Tagged<Partial<RecipeData>>, thunkAPI): Promise<Tagged<Partial<RecipeData>>> => {
  
    const res = await ApiClient.updateRecipe(updates);
    return {
      id: updates.id,
      data: res,
    };
  },
);

export const updateRecipeReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {
  builder.addCase(updateRecipe.pending, (state) => {
    state.loading = true;
  });
  
  builder.addCase(updateRecipe.fulfilled, (state, {payload}) => {
    state.loading = false;
    state.recipes[payload.id] = {...state.recipes[payload.id], ...payload.data};
    state.count = Object.keys(state.recipes).length;
  });
  
  builder.addCase(updateRecipe.rejected, (state) => {
    state.loading = false;
  });
};