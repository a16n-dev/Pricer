import React from 'react';
import { routeMap } from '../routeMap';

const LazyUnitIndex = React.lazy(() => import('../../pages/unit/UnitIndex'));

const unitRouteMap : routeMap = {
  routes: [
    {
      path: '/units',
      Component: LazyUnitIndex,
      exact: true,
    },
  ],

  redirects: [
    {
      from :'/units/*',
      to: '/units',
    },
  ],
};

export default unitRouteMap;