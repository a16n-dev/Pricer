import { ActionReducerMapBuilder, createAsyncThunk } from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { AuthState } from './AuthSlice';

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {

    if(process.env.NODE_ENV === 'development'){
      return localStorage.removeItem('auth');
    } else {
      return Auth.signOut();
    }

  },
);

export const logoutReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
    
  builder.addCase(logout.fulfilled, (state, action) => {
    state.isAuthenticated = false;
    delete state.token;
  });
  
};