import React from 'react';
import { renderRoutes, routeMap } from './routeMap';

const LazyLogin = React.lazy(() => import('../pages/auth/Login'));

const publicRouteMap : routeMap = {
  routes: [
    {
      path: '/login',
      Component: LazyLogin,
      exact: true,
    },
  ],

  redirects: [
    {
      from :'/*',
      to: '/login',
    },
  ],
};

export default renderRoutes(publicRouteMap);