import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Tagged } from '../../models/Common';
import { RecipeItemDetail } from '../../models/Recipe';
import RecipeState from './recipeState';

export const addRecipeIngredients = createAsyncThunk(
  'recipes/addIngredients',
  async (
    data: Tagged<Array<RecipeItemDetail>>,
    thunkAPI,
  ): Promise<Tagged<Array<RecipeItemDetail>>> => {

    const response = await ApiClient.addRecipeIngredients(data);

    return {
      id: data.id,
      data: response,
    };
  },
);

export const addRecipeIngredientsReducers = (
  builder: ActionReducerMapBuilder<RecipeState>,
) => {
  builder.addCase(
    addRecipeIngredients.fulfilled,
    (state, { payload: { id, data } }) => {
      const recipe = state.recipes[id];
      recipe.itemDetail = data;
    },
  );
};
