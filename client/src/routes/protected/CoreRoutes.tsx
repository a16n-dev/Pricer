import React from 'react';
import { routeMap } from '../routeMap';

const LazyDashboard = React.lazy(() => import('../../pages/dashboard/Dashboard'));

const coreRouteMap : routeMap = {
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

export default coreRouteMap;