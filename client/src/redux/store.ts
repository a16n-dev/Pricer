import { createStore, StoreEnhancer } from 'redux';
import rootReducer from './reducers/index';
import { rootState } from './types';

type WindowWithDevTools = Window & {
    __REDUX_DEVTOOLS_EXTENSION__: () => StoreEnhancer<unknown, {}>
   }
   
const isReduxDevtoolsExtenstionExist =
   (arg: Window | WindowWithDevTools):
     arg is WindowWithDevTools  => '__REDUX_DEVTOOLS_EXTENSION__' in arg;

export const initialState : rootState = {
  isAuthenticated: false,
};

export default createStore(
  rootReducer,
  initialState,
  isReduxDevtoolsExtenstionExist(window) ?
    window.__REDUX_DEVTOOLS_EXTENSION__() : undefined,
);