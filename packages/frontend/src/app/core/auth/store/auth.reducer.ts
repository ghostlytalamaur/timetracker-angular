import { Action, compose, createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';

import { User } from '../model';

import { AuthActions } from './actions';

export const authFeatureKey = 'auth';


const enum AuthStatusCode {
  Process = 'process',
  AutoSignInFailed = 'auto-sign-in-failed',
  SignedIn = 'signed-in',
  SignedOut = 'signed-out',
  Error = 'error',
}

interface ErrorStatus {
  type: AuthStatusCode.Error;
  message: string;
}

interface SignedIn {
  type: AuthStatusCode.SignedIn;
}

interface SignedOut {
  type: AuthStatusCode.SignedOut;
}

interface LoadingStatus {
  type: AuthStatusCode.Process;
}

interface AutoSignInFailed {
  type: AuthStatusCode.AutoSignInFailed;
}

export type AuthStatus = SignedOut | SignedIn | AutoSignInFailed | ErrorStatus | LoadingStatus;

export interface AuthState {
  user: User | null;
  status: AuthStatus;
}

const initialState: AuthState = {
  user: null,
  status: { type: AuthStatusCode.SignedOut },
};

const authReducers = createReducer<AuthState>(initialState,
  on(AuthActions.signIn, AuthActions.signUp, AuthActions.signOut, AuthActions.autoSignIn,
    (state): AuthState => ({
        ...state,
        status: { type: AuthStatusCode.Process },
      })),

  on(AuthActions.authError, (state, { message }) => ({
      ...state,
      user: null,
      status: {
        type: AuthStatusCode.Error,
        message,
      },
    })),

  on(AuthActions.authSuccess, (state, { user }) => ({
      ...state,
      user,
      status: { type: AuthStatusCode.SignedIn },
    })),

  on(AuthActions.autoSignInFailed, (state) => ({
      ...state,
      user: null,
      status: { type: AuthStatusCode.AutoSignInFailed },
    })),

  on(AuthActions.signOutSuccess, (state) => ({
      ...state,
      user: null,
      status: { type: AuthStatusCode.SignedOut },
    })),
);

export function reducers(state: AuthState, action: Action): AuthState {
  return authReducers(state, action);
}

const selectAuthState = createFeatureSelector<AuthState>(authFeatureKey);
export const selectUser = compose(
  state => state.user,
  selectAuthState,
);

export const selectIsSignedIn = compose(
  user => !!user,
  selectUser,
);

export const selectStatus = createSelector(
  selectAuthState,
  state => state.status,
);

export const selectIsLoading = compose(
  state => state.status.type === AuthStatusCode.Process,
  selectAuthState,
);

export const selectError = compose(
  state => state.status.type === AuthStatusCode.Error ? state.status.message : undefined,
  selectAuthState,
);
