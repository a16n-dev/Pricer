import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { addRecipeIngredientsReducers } from './addRecipeIngredients';
import { createRecipeReducers } from './CreateRecipe';
import { fetchRecipesReducer } from './fetchRecipes';
import RecipeState from './recipeState';

const RecipeSlice = createSlice<RecipeState, SliceCaseReducers<RecipeState>>({
  name: 'recipes',
  initialState: {
    count: 0,
    loading: false,
    recipes: {},
    isHydrated: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    createRecipeReducers(builder);
    fetchRecipesReducer(builder);
    addRecipeIngredientsReducers(builder);
  },
});

const { reducer } = RecipeSlice;
export default reducer;
