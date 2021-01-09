import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Tagged } from '../../models/Common';
import { RecipeItemDetail } from '../../models/Recipe';
import RecipeState from './recipeState';

export const updateRecipeIngredients = createAsyncThunk(
  'recipes/updateIngredients',
  async (
    data: Tagged<Array<RecipeItemDetail>>,
    thunkAPI,
  ): Promise<Tagged<Array<RecipeItemDetail>>> => {
    const response = await ApiClient.setRecipeIngredients(data);

    return {
      id: data.id,
      data: response,
    };
  },
);

export const updateRecipeIngredientsReducers = (
  builder: ActionReducerMapBuilder<RecipeState>,
) => {
  builder.addCase(
    updateRecipeIngredients.fulfilled,
    (state, { payload: { id, data } }) => {
      state.recipes[id].itemDetail = data;
      state.recipes[id].dateUpdated = Date.now();
      state.unsavedChanges = false;
    },
  );
};
