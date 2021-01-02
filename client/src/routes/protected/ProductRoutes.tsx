import React from 'react';
import { routeMap } from '../routeMap';

const LazyProductIndex = React.lazy(() => import('../../pages/product/ProductIndex'));
const LazyCreateProduct = React.lazy(() => import('../../pages/product/CreateProduct'));
const LazyEditProduct = React.lazy(() => import('../../pages/product/EditProduct'));

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
    {
      path: '/products/view/:id',
      Component: LazyEditProduct,
      exact: false,
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