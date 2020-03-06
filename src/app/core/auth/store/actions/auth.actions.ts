import { createAction, props } from '@ngrx/store';

import { User } from '../../model/user';

export const signUp = createAction(
  '[Auth] Sign Up',
  props<{ email: string, password: string }>(),
);

export const signIn = createAction(
  '[Auth] Sign In',
  props<{ email: string, password: string }>(),
);

export const signOut = createAction(
  '[Auth] Sign Out',
);

export const signOutSuccess = createAction(
  '[Auth] Sign Out Success',
);

export const authError = createAction(
  '[Auth] Auth Error',
  props<{ message: string }>(),
);

export const authSuccess = createAction(
  '[Auth] Auth Success',
  props<{ user: User }>(),
);

export const autoSignIn = createAction(
  '[Auth] Auth Auto Sign In',
);

export const autoSignInFailed = createAction(
  '[Auth] Auth Auto Sign In Failed',
);
