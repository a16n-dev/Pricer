import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import RecipeState from './recipeState';

export const deleteRecipe = createAsyncThunk(
  'recipes/delete',
  async (recipeId: string, thunkAPI): Promise<string> => {
  
    // const recipe = await ApiClient.createRecipe(recipeData);
    const a = 3;
    return recipeId;
  },
);

export const deleteRecipeReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {
  builder.addCase(deleteRecipe.pending, (state, action ) => {
    state.loading = true;
  });
  
  builder.addCase(deleteRecipe.fulfilled, (state, {payload}) => {
    state.loading = false;
    delete state.recipes[payload];
    state.count = Object.keys(state.recipes).length;
  });
  
  builder.addCase(deleteRecipe.rejected, (state, action) => {
    state.loading = false;
  });
};