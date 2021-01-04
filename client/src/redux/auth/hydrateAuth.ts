import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { ApiClient } from '../../api/client';
import AuthState from './authState';

export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async (): Promise<string> => {
    
    if(process.env.NODE_ENV === 'development'){
      const d = localStorage.getItem('auth');
      if(d){
        return d;
      }else {
        Promise.reject();
      }
    }
    const res = await Auth.currentAuthenticatedUser();
    const token = res.signInUserSession.idToken.jwtToken;

    ApiClient.setToken(token);

    return token;
  },
);

export const hydrateAuthReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
    
  builder.addCase(hydrateAuth.fulfilled, (state, {payload}) => {
    state.resolvingAuthState = false;
    state.isAuthenticated = true;
    state.token = payload;
  });
  builder.addCase(hydrateAuth.rejected, (state, action) => {
    state.resolvingAuthState = false;
  });

};