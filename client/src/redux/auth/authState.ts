type AuthState = {
  resolvingAuthState: boolean;
  isAuthenticated: boolean;
  token?: string;
};

export default AuthState;
