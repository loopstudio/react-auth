import { createContext, useState, useCallback, useEffect } from 'react';
import { AxiosInstance } from 'axios';
import AuthService from './services/AuthService';
import { applyInterceptors, clearInterceptors } from './services/middleware';

export interface ISession {
  accessToken: string;
  client: string;
  uid: string;
}

interface IAuthState {
  isLoading: boolean;
  session: ISession | null;
  user: any;
}

export interface IAuthContext extends IAuthState {
  isAuthenticated: boolean;
  signIn: (values: any) => any | void;
  signUp: (values: any) => any | void;
  updateUser: (values: any) => any | void;
  signOut: () => any | void;
  clearSession: () => void;
  requestPasswordReset: (values: any) => any | void;
  verifyPasswordReset: (values: any) => any | void;
  resetPassword: (pwd: any, resetPasswordToken: any) => any | void;
}

interface IAuthProvider {
  children: JSX.Element;
  httpClient: AxiosInstance;
  prepopulatedState?: IAuthState | null;
}

export const AuthContext = createContext({} as IAuthContext);

const defaultState = {
  user: null,
  session: null,
  isLoading: false,
};

const initialState = () => {
  const storedSession = JSON.parse(localStorage.getItem('session') as string);
  if (storedSession) {
    return { ...defaultState, session: storedSession, isLoading: true };
  }
  return defaultState;
};

export function AuthProvider({
  children,
  httpClient,
  prepopulatedState,
}: IAuthProvider) {
  const [state, setState] = useState<IAuthState>(
    prepopulatedState || initialState
  );
  const { user, session, isLoading } = state;

  const validateSession = useCallback(async () => {
    if (isLoading && session) {
      try {
        const response = await AuthService.validateToken();
        const {
          headers: { accessToken, client, uid },
          data,
        } = response;

        setState({
          session: { accessToken, client, uid },
          user: data.user,
          isLoading: false,
        });
      } catch {
        setState(defaultState);
      }
    }
  }, [isLoading, session]);

  const signIn = useCallback(async (values) => {
    const response = await AuthService.signIn(values);
    const {
      headers: { accessToken, client, uid },
      data,
    } = response;

    setState({
      session: { accessToken, client, uid },
      user: data.user,
      isLoading: false,
    });

    return response;
  }, []);

  const signUp = useCallback(async (values) => {
    const response = await AuthService.signUp(values);
    const {
      headers: { accessToken, client, uid },
      data,
    } = response;

    setState({
      session: { accessToken, client, uid },
      user: data.user,
      isLoading: false,
    });

    return response;
  }, []);

  const updateUser = useCallback(async (values, passwordCheck = null) => {
    const response = await AuthService.updateUser(values, passwordCheck);
    const { data } = response;

    setState((prevState) => ({ ...prevState, user: data.user }));

    return response;
  }, []);

  const signOut = useCallback(async () => {
    setState(defaultState);
    return AuthService.signOut();
  }, []);

  const clearSession = useCallback(async () => {
    setState(defaultState);
  }, []);

  const requestPasswordReset = useCallback(
    (email) => AuthService.requestPasswordReset(email),
    []
  );

  const verifyPasswordReset = useCallback(
    (resetPasswordToken) => AuthService.verifyPasswordReset(resetPasswordToken),
    []
  );

  const resetPassword = useCallback(async (password, resetPasswordToken) => {
    const response = await AuthService.resetPassword(
      password,
      resetPasswordToken
    );
    const {
      headers: { accessToken, client, uid },
      data,
    } = response;

    setState({
      session: { accessToken, client, uid },
      user: data.user,
      isLoading: false,
    });

    return response;
  }, []);

  useEffect(() => {
    AuthService.setHttpClient(httpClient);
  }, [httpClient]);

  useEffect(() => {
    const interceptors = applyInterceptors(httpClient, session, clearSession);

    return () => clearInterceptors(httpClient, interceptors);
  }, [httpClient, session, clearSession]);

  useEffect(() => {
    validateSession();
  }, [validateSession]);

  useEffect(() => {
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
    } else {
      localStorage.removeItem('session');
    }
  }, [session]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: user !== null,
        session,
        user,
        signIn,
        signUp,
        updateUser,
        signOut,
        clearSession,
        requestPasswordReset,
        verifyPasswordReset,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.defaultProps = {
  prepopulatedState: null,
};
