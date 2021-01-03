import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthSlice';

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await Auth.signOut();
  },
);

export const logoutReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
    
  builder.addCase(logout.fulfilled, (state, action) => {
    state.isAuthenticated = false;
    delete state.token;
  });
  
};