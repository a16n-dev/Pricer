import React from 'react';
import { routeMap } from '../routeMap';

const LazyProductIndex = React.lazy(() => import('../../pages/product/ProductIndex'));
const LazyCreateProduct = React.lazy(() => import('../../pages/product/CreateProduct'));

const productRouteMap : routeMap = {
  routes: [
    {
      path: '/products',
      Component: LazyProductIndex,
      exact: true,
    },
    {
      path: '/products/new',
      Component: LazyCreateProduct,
      exact: true,
    },
  ],

  redirects: [
    {
      from :'/products/*',
      to: '/products',
    },
  ],
};

export default productRouteMap;