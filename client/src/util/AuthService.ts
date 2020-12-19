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
}

export const AuthService : IAuthService = {

  isAuthenticated: async () => {

    const res = await Auth.currentUserInfo();
  
    console.log(res);
    return res !== null;
  
  },

  configure: () => {
    Amplify.configure(awsconfig);
  },

  signIn: (username, password) => Auth.signIn(username, password),

  signOut: () => Auth.signOut(),

};
