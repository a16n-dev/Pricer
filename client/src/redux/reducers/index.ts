import { Action, Reducer } from 'redux';
import { AuthService } from '../../util/AuthService';
import { LOGIN, LOGOUT } from '../constants/actionTypes';
import { initialState } from '../store';
import { rootState } from '../types';
  
const rootReducer : Reducer<rootState, Action<String>> =
(state: rootState = initialState, action: Action<String>) => {
  switch(action.type){
  case LOGIN:
    return {
      isAuthenticated: true,
    };

  case LOGOUT:
    AuthService.signOut();
    return {
      isAuthenticated: false,
    };
  default:
    return state;
  }
};
  
export default rootReducer;