import {
  createAsyncThunk,
  createSlice,
  SliceCaseReducers,
} from '@reduxjs/toolkit';
import { Auth } from 'aws-amplify';

export type AuthState = {
  resolvingAuthState: boolean;
  isAuthenticated: boolean;
  token?: string;
}
  
// eslint-disable-next-line max-len
export const login = createAsyncThunk<
  any,
  {username:string; password: string},
  {rejectValue: {__type: string, message: string}}
>(
  'auth/login',
  async ({username, password} , thunkAPI) => Auth.signIn(username, password),
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await Auth.signOut();
  },
);

export const hydrateAuth = createAsyncThunk(
  'auth/hydrate',
  async () => {
    await Auth.currentAuthenticatedUser();
  },
);

  
const AuthSlice = createSlice<AuthState, SliceCaseReducers<AuthState>>({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    resolvingAuthState: true,
  },
  reducers: {
     
  },
  extraReducers: builder => {
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;

    });
  
    builder.addCase(login.rejected, (state, action) => {

    });

    builder.addCase(hydrateAuth.fulfilled, (state, action) => {
      state.resolvingAuthState = false;
      state.isAuthenticated = true;
    });
    builder.addCase(hydrateAuth.rejected, (state, action) => {
      state.resolvingAuthState = false;
    });

    builder.addCase(logout.fulfilled, (state, action) => {
      state.isAuthenticated = false;
    });
  },
});
    
// Extract the action creators object and the reducer
const { reducer } = AuthSlice;
  
// Extract and export each action creator by name
// export const { CreateProduct, updateProduct, deleteProduct } = actions;
  
// Export the reducer, either as a default or named export
export default reducer;