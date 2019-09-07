import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromAuth from './store';
import { Injectable } from '@angular/core';
import { AuthActions } from './store/actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private readonly store: Store<fromAuth.State>
  ) {
    this.store.dispatch(AuthActions.autoSignIn());
  }

  isSignedIn(): Observable<boolean> {
    return this.store.select(fromAuth.isSignedIn);
  }

  signUp(credentials: { email: string, password: string }): void {
    this.store.dispatch(AuthActions.signUp(credentials));
  }

  signIn(credentials: { email: string, password: string }): void {
    this.store.dispatch(AuthActions.signIn(credentials));
  }

  logout(): void {
    this.store.dispatch(AuthActions.signOut());
  }

  isLoading(): Observable<boolean> {
    return this.store.select(fromAuth.isLoading);
  }

  getError(): Observable<string | undefined> {
    return this.store.select(fromAuth.getError);
  }
}
