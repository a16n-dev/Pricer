import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';
import { hydrateAuthReducers } from './hydrateAuth';
import { loginReducers } from './login';
import { logoutReducers } from './logout';

export type AuthState = {
  resolvingAuthState: boolean;
  isAuthenticated: boolean;
  token?: string;
}
  
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