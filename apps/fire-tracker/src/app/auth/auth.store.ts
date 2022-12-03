import {
  createActionGroup,
  createFeature,
  createReducer,
  emptyProps,
  on,
  props,
} from '@ngrx/store';

export interface User {
  readonly id: string;
  readonly email: string;
}

interface State {
  readonly user: User | undefined;
  readonly inSilentSignIn: boolean;
  readonly error: string;
}

export const authActions = createActionGroup({
  source: 'Auth',
  events: {
    'Silent Sign In': emptyProps(),
    'Silent Sign In Success': props<{ user: User }>(),
    'Silent Sign In Failure': emptyProps(),
    'Sign In': props<{ email: string; password: string }>(),
    'Sign In Failure': props<{ error: string }>(),
    'Sign In Success': props<{ user: User }>(),
    'Sign Out': emptyProps(),
  },
});

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
