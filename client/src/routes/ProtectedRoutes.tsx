import coreRouteMap from './protected/CoreRoutes';
import productRouteMap from './protected/ProductRoutes';
import recipeRouteMap from './protected/RecipeRoutes';
import unitRouteMap from './protected/UnitRoutes';
import utilRouteMap from './protected/UtilRoutes';
import { renderRoutes, routeMap } from './routeMap';

const protectedRouteMap : routeMap = {
  routes: [
    ...(coreRouteMap.routes || []),
    ...(productRouteMap.routes || []),
    ...(utilRouteMap.routes || []),
    ...(unitRouteMap.routes || []),
    ...(recipeRouteMap.routes || []),
  ],

  redirects: [
    ...(coreRouteMap.redirects || []),
    ...(productRouteMap.redirects || []),
    ...(utilRouteMap.redirects || []),
    ...(unitRouteMap.redirects || []),
    ...(recipeRouteMap.redirects || []),
  ],
};

export default renderRoutes(protectedRouteMap);