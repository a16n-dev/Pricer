import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { ApiClient } from '../../api/client';
import { Recipe } from '../../models/Recipe';
import RecipeState from './recipeState';

export const fetchRecipes = createAsyncThunk(
  'recipes/fetch',
  async (): Promise<Array<Recipe>> => {
    const recipes = await ApiClient.fetchRecipes();
    return recipes;
  },
);

export const fetchRecipesReducer = (builder: ActionReducerMapBuilder<RecipeState>) => {

  builder.addCase(fetchRecipes.pending, (state, {payload}) => {
    state.isHydrated = false;
  });

  builder.addCase(fetchRecipes.fulfilled, (state, {payload}) => {
    state.recipes = (new Array(...payload)).reduce((map: any, p) => {
      map[p.id] = p;
      return map;
    }, {});
    state.count = Object.keys(state.recipes).length;
    state.isHydrated = true;
  });
};