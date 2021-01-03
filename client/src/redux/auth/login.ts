import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthSlice';

// eslint-disable-next-line max-len
export const login = createAsyncThunk<
  any,
  {username:string; password: string},
  {rejectValue: {__type: string, message: string}}
>(
  'auth/login',
  async ({username, password}) => Auth.signIn(username, password),
);

export const loginReducers = (builder: ActionReducerMapBuilder<AuthState>) => {

  builder.addCase(login.fulfilled, (state, action) => {
    state.isAuthenticated = true;
  });
  
};