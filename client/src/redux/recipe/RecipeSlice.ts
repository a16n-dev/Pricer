import { createSlice, PayloadAction, SliceCaseReducers } from '@reduxjs/toolkit';
import { RecipeItemDetail } from '../../models/Recipe';
import { addRecipeIngredientsReducers } from './addRecipeIngredients';
import { createRecipeReducers } from './CreateRecipe';
import { fetchRecipesReducer } from './fetchRecipes';
import RecipeState from './recipeState';
import { updateRecipeIngredientsReducers } from './updateRecipeIngredients';

export interface ItemDetailPayload {
  recipeId: string,
  detail: RecipeItemDetail,
}

const RecipeSlice = createSlice<RecipeState, SliceCaseReducers<RecipeState>>({
  name: 'recipes',
  initialState: {
    count: 0,
    loading: false,
    recipes: {},
    isHydrated: false,
    unsavedChanges: false,
  },
  reducers: {
    saveItemDetail: (state: RecipeState, {payload}: PayloadAction<ItemDetailPayload>) => {
      const recipe = state.recipes[payload.recipeId];
      const itemIndex = recipe.itemDetail.findIndex(i => i.plainText === payload.detail.plainText);
      if(itemIndex !== -1){
        recipe.itemDetail[itemIndex] =  payload.detail;
        state.unsavedChanges = true;
      }
    },
    deleteItemDetail: (state: RecipeState, {payload}: PayloadAction<ItemDetailPayload>) => {
      const recipe = state.recipes[payload.recipeId];
      const itemIndex = recipe.itemDetail.findIndex(i => i.plainText === payload.detail.plainText);
      if(itemIndex !== -1){
        recipe.itemDetail.splice(itemIndex, 1);
        state.unsavedChanges = true;
      }
    },
  },
  extraReducers: (builder) => {
    createRecipeReducers(builder);
    fetchRecipesReducer(builder);
    addRecipeIngredientsReducers(builder);
    updateRecipeIngredientsReducers(builder);
  },
});

export const { saveItemDetail, deleteItemDetail } = RecipeSlice.actions;

const { reducer } = RecipeSlice;
export default reducer;
