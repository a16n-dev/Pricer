import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import AuthState from './authState';

// eslint-disable-next-line max-len
export const login = createAsyncThunk<
  any,
  {username:string; password: string},
  {rejectValue: {__type: string, message: string}}
>(
  'auth/login',
  async ({username, password}) => {
    if(process.env.NODE_ENV === 'development'){
      return localStorage.setItem('auth', 'fakeToken');
    } else {
      return Auth.signIn(username, password);
    }
  },
);

export const loginReducers = (builder: ActionReducerMapBuilder<AuthState>) => {

  builder.addCase(login.fulfilled, (state, action) => {
    state.isAuthenticated = true;
  });
  
};