import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Credentials, User } from './model';
import * as fromAuth from './store';
import { AuthActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private readonly store: Store,
  ) {
  }

  get user$(): Observable<User | null> {
    return this.store.select(fromAuth.selectUser);
  }

  isSignedIn(): Observable<boolean> {
    return this.store.select(fromAuth.selectIsSignedIn);
  }

  getStatus$(): Observable<fromAuth.AuthStatus> {
    return this.store.select(fromAuth.selectStatus);
  }

  autoSignIn(): void {
    this.store.dispatch(AuthActions.autoSignIn());
  }

  signUp(credentials: Credentials): void {
    this.store.dispatch(AuthActions.signUp(credentials));
  }

  signIn(credentials: Credentials): void {
    this.store.dispatch(AuthActions.signIn(credentials));
  }

  logout(): void {
    this.store.dispatch(AuthActions.signOut());
  }

  isLoading(): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoading);
  }

  getError(): Observable<string | undefined> {
    return this.store.select(fromAuth.selectError);
  }
}
