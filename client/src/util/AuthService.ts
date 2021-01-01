import Amplify, { Auth } from 'aws-amplify';
import awsconfig from '../aws-exports';

/**
 * Service to abstract the authentication logic behind another layer
 * so only the required methods are exposed.
 */

export interface IAuthService {
    isAuthenticated: () => Promise<boolean>;
    configure: () => void;
    signIn: (username: string, password: string) => Promise<void>;
    signOut: () => void;
    token: () => Promise<string>;
}

export const AuthService : IAuthService = {

  isAuthenticated: async () => {
    const res = await Auth.currentUserInfo();
    return res !== null;
  },

  configure: () => {
    
  },

  signIn: async (username, password) => Auth.signIn(username, password),

  signOut: () => Auth.signOut(),

  token: async () => {
    const res = await Auth.currentSession();
    return res.getIdToken().getJwtToken();
  },
};
