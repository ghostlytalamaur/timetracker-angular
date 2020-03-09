import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { Credentials, User } from './model';
import * as fromAuth from './store';
import { AuthActions } from './store/actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public constructor(
    private readonly store: Store<fromAuth.State>,
  ) {
    this.store.dispatch(AuthActions.autoSignIn());
  }


  public get user$(): Observable<User | undefined> {
    return this.store.select(fromAuth.getUser);
  }

  public get user(): Promise<User | undefined> {
    return this.user$
      .pipe(first())
      .toPromise();
  }

  public isSignedIn(): Observable<boolean> {
    return this.store.select(fromAuth.isSignedIn);
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
    return this.store.select(fromAuth.isLoading);
  }

  public getError(): Observable<string | undefined> {
    return this.store.select(fromAuth.getError);
  }
}
