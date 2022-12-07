import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';

export interface User {
  readonly id: string;
  readonly email: string;
}

interface State {
  readonly user: User | undefined;
  readonly inSilentSignIn: boolean;
  readonly error: string;
}

export const authActions = {
  silentSignIn: createAction('[Auth] Silent Sign In'),
  silentSignInSuccess: createAction('[Auth] Silent Sign In Success', props<{ user: User }>()),
  silentSignInFailure: createAction('[Auth] Silent Sign In Failure'),
  signIn: createAction('[Auth] Sign In', props<{ email: string; password: string }>()),
  signInFailure: createAction('[Auth] Sign In Failure', props<{ error: string }>()),
  signInSuccess: createAction('[Auth] Sign In Success', props<{ user: User }>()),
  signOut: createAction('[Auth] Sign Out'),
};

const defaults: State = { user: undefined, error: '', inSilentSignIn: false };
export const authFeature = createFeature({
  name: 'auth',
  reducer: createReducer(
    defaults,
    on(authActions.silentSignIn, (state): State => {
      return { ...state, inSilentSignIn: true };
    }),
    on(authActions.silentSignInSuccess, authActions.silentSignInFailure, (state): State => {
      return { ...state, inSilentSignIn: false };
    }),
    on(authActions.signIn, authActions.silentSignInSuccess, (state): State => {
      return { ...state, error: '' };
    }),
    on(authActions.signInSuccess, authActions.silentSignInSuccess, (state, { user }): State => {
      return { ...state, user };
    }),
    on(authActions.signInFailure, (state, { error }): State => {
      return { ...state, error };
    }),
    on(authActions.signOut, (): State => {
      return defaults;
    }),
  ),
});
