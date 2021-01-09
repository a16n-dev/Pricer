import React from 'react';
import { routeMap } from '../routeMap';

const LazyRecipeDetail = React.lazy(
  () => import('../../pages/recipe/RecipeDetail/RecipeDetail'),
);
const LazyRecipeIndex = React.lazy(
  () => import('../../pages/recipe/RecipeIndex'),
);
const LazyRecipeAnalysisOverview = React.lazy(
  () => import('../../pages/recipe/RecipeAnalysisOverview'),
);

const recipeRouteMap: routeMap = {
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
    {
      path: '/recipes/view/:id/analysis',
      Component: LazyRecipeAnalysisOverview,
      exact: true,
    },
  ],

  redirects: [
    {
      from: '/recipes/*',
      to: '/recipes',
    },
  ],
};

export default recipeRouteMap;
