import coreRouteMap from './protected/CoreRoutes';
import productRouteMap from './protected/ProductRoutes';
import utilRouteMap from './protected/UtilRoutes';
import { renderRoutes, routeMap } from './routeMap';

const protectedRouteMap : routeMap = {
  routes: [
    ...(coreRouteMap.routes || []),
    ...(productRouteMap.routes || []),
    ...(utilRouteMap.routes || []),
  ],

  redirects: [
    ...(coreRouteMap.redirects || []),
    ...(productRouteMap.redirects || []),
    ...(utilRouteMap.redirects || []),
  ],
};

export default renderRoutes(protectedRouteMap);