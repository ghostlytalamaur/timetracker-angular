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
  public constructor(
    private readonly store: Store,
  ) {
  }

  public get user$(): Observable<User | null> {
    return this.store.select(fromAuth.selectUser);
  }

  public isSignedIn(): Observable<boolean> {
    return this.store.select(fromAuth.selectIsSignedIn);
  }

  public getStatus$(): Observable<fromAuth.AuthStatus> {
    return this.store.select(fromAuth.selectStatus);
  }

  public autoSignIn(): void {
    this.store.dispatch(AuthActions.autoSignIn());
  }

  public signUp(credentials: Credentials): void {
    this.store.dispatch(AuthActions.signUp(credentials));
  }

  public signIn(credentials: Credentials): void {
    this.store.dispatch(AuthActions.signIn(credentials));
  }

  public logout(): void {
    this.store.dispatch(AuthActions.signOut());
  }

  public isLoading(): Observable<boolean> {
    return this.store.select(fromAuth.selectIsLoading);
  }

  public getError(): Observable<string | undefined> {
    return this.store.select(fromAuth.selectError);
  }
}
