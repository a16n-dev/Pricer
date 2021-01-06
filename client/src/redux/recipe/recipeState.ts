import { Recipe } from '../../models/Recipe';

type RecipeState = {
  count: number;
  loading: boolean;
  recipes: { [key: string]: Recipe };
  isHydrated: boolean;
};

export default RecipeState;
