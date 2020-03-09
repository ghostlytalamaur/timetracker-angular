import { Action, ActionReducer, Selector, compose, createFeatureSelector, createReducer, on } from '@ngrx/store';

import * as fromRoot from '../../store';
import { User } from '../model';

import { AuthActions } from './actions';

export const authFeatureKey = 'auth';

interface ErrorStatus {
  type: 'error';
  message: string;
}

interface LoadingStatus {
  type: 'loading';
}

type Status = ErrorStatus | LoadingStatus;

export interface AuthState {
  user: User | undefined;
  status: Status | undefined;
}

export interface State extends fromRoot.State {
  [authFeatureKey]: AuthState;
}

const initialState: AuthState = {
  user: undefined,
  status: undefined,
};

const authReducers: ActionReducer<AuthState, Action> = createReducer<AuthState>(initialState,
  on(AuthActions.signIn, AuthActions.signUp, AuthActions.signOut, AuthActions.autoSignIn, (state): AuthState => {
    return {
      ...state,
      status: { type: 'loading' },
    };
  }),

  on(AuthActions.authError, (state, { message }) => {
    return {
      ...state,
      status: { type: 'error', message },
    };
  }),

  on(AuthActions.authSuccess, (state, { user }) => {
    return {
      ...state,
      user,
      status: undefined,
    };
  }),

  on(AuthActions.autoSignInFailed, (state) => {
    return {
      ...state,
      status: undefined,
    };
  }),

  on(AuthActions.signOutSuccess, (state) => {
    return {
      ...state,
      user: undefined,
      status: undefined,
    };
  }),
);

export function reducers(state: AuthState, action: Action): AuthState {
  return authReducers(state, action);
}

const selectAuthState: Selector<State, AuthState> = createFeatureSelector(authFeatureKey);
export const getUser: Selector<State, User | undefined> = compose(
  state => state.user,
  selectAuthState,
);

export const isSignedIn: Selector<State, boolean> = compose(
  user => !!user,
  getUser,
);

export const isLoading: Selector<State, boolean> = compose(
  state => !!(state.status && state.status.type === 'loading'),
  selectAuthState,
);

export const getError: Selector<State, string | undefined> = compose(
  state => state.status && state.status.type === 'error' ? state.status.message : undefined,
  selectAuthState,
);
