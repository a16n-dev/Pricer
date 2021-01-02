import coreRouteMap from './protected/CoreRoutes';
import productRouteMap from './protected/ProductRoutes';
import unitRouteMap from './protected/UnitRoutes';
import utilRouteMap from './protected/UtilRoutes';
import { renderRoutes, routeMap } from './routeMap';

const protectedRouteMap : routeMap = {
  routes: [
    ...(coreRouteMap.routes || []),
    ...(productRouteMap.routes || []),
    ...(utilRouteMap.routes || []),
    ...(unitRouteMap.routes || []),
  ],

  redirects: [
    ...(coreRouteMap.redirects || []),
    ...(productRouteMap.redirects || []),
    ...(utilRouteMap.redirects || []),
    ...(unitRouteMap.redirects || []),
  ],
};

export default renderRoutes(protectedRouteMap);