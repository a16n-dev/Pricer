import React from 'react';
import { renderRoutes, routeMap } from './routeMap';

const LazyDashboard = React.lazy(() => import('../pages/dashboard/Dashboard'));

const protectedRouteMap : routeMap = {
  routes: [
    {
      path: '/',
      Component: LazyDashboard,
      exact: true,
    },
  ],

  redirects: [
    {
      from :'/*',
      to: '/',
    },
  ],
};

export default renderRoutes(protectedRouteMap);