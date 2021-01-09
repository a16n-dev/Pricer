import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Tagged } from '../../models/Common';
import { RecipeAnalysis } from '../../models/Recipe';
import RecipeState from './recipeState';

export const saveAnalysis = createAsyncThunk(
  'recipes/saveAnalysis',
  async (data: Tagged<RecipeAnalysis>, thunkAPI): Promise<Tagged<RecipeAnalysis>> => {
  
    const res = await ApiClient.saveRecipeAnalysis(data);
    return res;
  },
);

export const saveAnalysisReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {

  builder.addCase(saveAnalysis.fulfilled, (state, {payload}) => {
    state.recipes[payload.id].lastAnalysis = payload.data;
    state.count = Object.keys(state.recipes).length;
  });
};