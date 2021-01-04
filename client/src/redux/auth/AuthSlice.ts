import {
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import AuthState from './authState';
import { hydrateAuthReducers } from './hydrateAuth';
import { loginReducers } from './login';
import { logoutReducers } from './logout';
  
const AuthSlice = createSlice<AuthState, SliceCaseReducers<AuthState>>({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    resolvingAuthState: true,
  },
  reducers: {
     
  },
  extraReducers: builder => {
    loginReducers(builder);
    hydrateAuthReducers(builder);
    logoutReducers(builder);
  },
});
    

const { reducer } = AuthSlice;
  
export default reducer;