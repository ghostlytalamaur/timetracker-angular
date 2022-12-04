import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, take, tap } from 'rxjs';
import { getErrorMessage } from '../utils/get-error-message';
import { authActions } from './auth.store';
import { Router } from '@angular/router';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export class AuthEffects {
  private readonly actions = inject(Actions);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  public readonly onSilentSignIn = createEffect(() => {
    return this.actions.pipe(
      ofType(authActions.silentSignIn),
      switchMap(() => {
        return user(this.auth).pipe(
          take(1),
          map((user) => {
            if (user) {
              return authActions.silentSignInSuccess({
                user: { id: user.uid, email: user.email ?? '' },
              });
            }

            return authActions.silentSignInFailure();
          }),
          catchError(() => of(authActions.silentSignInFailure())),
        );
      }),
    );
  });

  public readonly onSignIn = createEffect(() => {
    return this.actions.pipe(
      ofType(authActions.signIn),
      switchMap(async ({ email, password }) => {
        try {
          const res = await signInWithEmailAndPassword(this.auth, email, password);

          return authActions.signInSuccess({
            user: { id: res.user.uid, email: res.user.email ?? '' },
          });
        } catch (err) {
          return authActions.signInFailure({ error: getErrorMessage(err) });
        }
      }),
    );
  });

  public readonly onSignInSuccess = createEffect(
    () => {
      return this.actions.pipe(
        ofType(authActions.signInSuccess),
        tap(() => this.router.navigate(['/'])),
      );
    },
    { dispatch: false },
  );

  public readonly onSignOut = createEffect(
    () => {
      return this.actions.pipe(
        ofType(authActions.signOut),
        tap(async () => {
          await signOut(this.auth);
          await this.router.navigate(['/login']);
        }),
      );
    },
    { dispatch: false },
  );
}
