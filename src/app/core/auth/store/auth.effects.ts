import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, from, of } from 'rxjs';
import { catchError, map, switchMap, take, tap } from 'rxjs/operators';

import { createUser } from '../model';

import { AuthActions } from './actions';
import UserCredential = firebase.auth.UserCredential;

@Injectable()
export class AuthEffects {

  public autoSignIn$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.autoSignIn),
        switchMap(() => this.handleAutoSign()),
      ),
  );

  public signUp$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.signUp),
        switchMap(credentials => this.handleSignUp(credentials)),
      ),
  );

  public signIn$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.signIn),
        switchMap(credentials => this.handleSignIn(credentials)),
      ),
  );

  public signOut$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(AuthActions.signOut),
        switchMap(() => this.handleSignOut()),
      ),
  );

  public signOutSuccess$ = createEffect(() =>
      this.actions$
        .pipe(
          ofType(AuthActions.signOutSuccess),
          tap(() => this.router.navigate(['/login'])),
        ),
    { dispatch: false });

  public constructor(
    private readonly actions$: Actions,
    private readonly afa: AngularFireAuth,
    private readonly router: Router,
  ) {
  }

  private handleSignUp(credentials: { email: string, password: string }): Observable<Action> {
    const auth = this.afa.createUserWithEmailAndPassword(credentials.email, credentials.password);
    return this.handleAuth(auth);
  }

  private handleSignIn(credentials: { email: string, password: string }): Observable<Action> {
    const auth = this.afa.signInWithEmailAndPassword(credentials.email, credentials.password);
    return this.handleAuth(auth);
  }

  private handleAuth(fireUser: Promise<UserCredential>): Observable<Action> {
    const maybeUser = fireUser.then(userCredential => {
      if (userCredential.user && userCredential.user.email) {
        return createUser(userCredential.user.uid, userCredential.user.email);
      }
      throw new Error('Authentication failed');
    });

    return from(maybeUser)
      .pipe(
        map(user => AuthActions.authSuccess({ user })),
        tap(ignored => this.router.navigate(['/'])),
        catchError(err => {
          const errMsg = err instanceof Error ? err.message : 'Authentication failed. Unknown error.';
          return of(AuthActions.authError({ message: errMsg }));
        }),
      );
  }

  private handleSignOut(): Observable<Action> {
    const res: Promise<Action> = this.afa.signOut()
      .then(() => AuthActions.signOutSuccess())
      .catch((err: unknown) => {
        const errMsg = err instanceof Error ? err.message : 'Cannot sign out. Unknown error';
        return AuthActions.authError({ message: errMsg });
      });

    return from(res);
  }

  private handleAutoSign(): Observable<Action> {
    return this.afa.user
      .pipe(
        map(user => {
          if (user && user.email) {
            return AuthActions.authSuccess({ user: createUser(user.uid, user.email) });
          } else {
            return AuthActions.autoSignInFailed();
          }
        }),
        take(1),
      );
  }
}
