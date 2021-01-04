import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthSlice';

export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async (): Promise<string> => {
    
    if(process.env.NODE_ENV === 'development'){
      const d =  localStorage.getItem('auth');
      if(d){
        return d;
      }else {
        Promise.reject();
      }
    }
    const res = await Auth.currentAuthenticatedUser();
    console.log(res.signInUserSession.idToken.jwtToken);
    return res.signInUserSession.idToken.jwtToken;
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