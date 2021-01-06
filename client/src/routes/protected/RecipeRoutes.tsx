import React from 'react';
import { routeMap } from '../routeMap';

const LazyRecipeDetail = React.lazy(() => import('../../pages/recipe/RecipeDetail/RecipeDetail'));
const LazyRecipeIndex = React.lazy(() => import('../../pages/recipe/RecipeIndex'));

const recipeRouteMap : routeMap = {
  routes: [
    {
      path: '/recipes/view/:id',
      Component: LazyRecipeDetail,
      exact: true,
    },
    {
      path: '/recipes',
      Component: LazyRecipeIndex,
      exact: true,
    },
  ],

  redirects: [
    {
      from :'/recipes/*',
      to: '/recipes',
    },
  ],
};

export default recipeRouteMap;