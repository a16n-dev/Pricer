import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Recipe, RecipeData, RecipeItemDetail } from '../../models/Recipe';
import RecipeState from './recipeState';

export interface addRecipeIngredientsData {
    id: string;
    ingredients: Array<RecipeItemDetail>
}

export const addRecipeIngredients = createAsyncThunk(
  'recipes/addIngredients',
  async (data: addRecipeIngredientsData, thunkAPI): Promise<addRecipeIngredientsData> => {
  
    // const recipe = await ApiClient.createRecipe(recipeData);
    const res = 3;
    return data;
  },
);

export const addRecipeIngredientsReducers = (builder: ActionReducerMapBuilder<RecipeState>) => {
  builder.addCase(addRecipeIngredients.fulfilled, (state, {payload: {id, ingredients} } ) => {
    const recipe = state.recipes[id];
    recipe.itemDetail.push(...ingredients);
  });
};