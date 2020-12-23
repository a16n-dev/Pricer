import coreRouteMap from './protected/CoreRoutes';
import productRouteMap from './protected/ProductRoutes';
import { renderRoutes, routeMap } from './routeMap';

const protectedRouteMap : routeMap = {
  routes: [
    ...(coreRouteMap.routes || []),
    ...(productRouteMap.routes || []),
  ],

  redirects: [
    ...(coreRouteMap.redirects || []),
    ...(productRouteMap.redirects || []),
  ],
};

export default renderRoutes(protectedRouteMap);