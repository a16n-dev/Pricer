import React from 'react';
import { routeMap } from '../routeMap';

const LazyNotFound = React.lazy(() => import('../../pages/common/NotFound'));

const utilRouteMap : routeMap = {
  routes: [
    {
      path: '/not-found',
      Component: LazyNotFound,
      exact: false,
    },
  ],
};

export default utilRouteMap;