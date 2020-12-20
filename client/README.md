# Pricer App

This is the source code for Pricer. This app allows users to build a database of products and recipes in order to get price estimates for the cost of recipes.

## Development

To start development clone the repo and run `yarn` to install all dependencies

## Info

### Routing system

The routing system is built on top of react-router in such a way that we don't have to write any react. Instead, routes and redirects are defined as a routeMap object which we can then pass into the `renderRoutes()` function to generate the dom. Refer to the following example for reference:

```js
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
```

*Note: Lazy loading pages is a good idea.*
