import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService as Auth0Service } from '@auth0/auth0-angular';

import { distinctUntilChanged, map } from 'rxjs/operators';
import { User } from './model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private readonly auth0: Auth0Service) {}

  get accessToken$(): Observable<string> {
    return this.auth0.getAccessTokenSilently().pipe(distinctUntilChanged());
  }

  get user$(): Observable<User | null> {
    return this.auth0.user$.pipe(
      map((user) => {
        return {
          id: user.sub,
          name: `${user.given_name} ${user.family_name}`.trim(),
        };
      }),
    );
  }

  isSignedIn(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }

  signIn(): void {
    this.auth0.loginWithRedirect();
  }

  logout(): void {
    this.auth0.logout();
  }

  isLoading$(): Observable<boolean> {
    return this.auth0.isLoading$;
  }

  getError(): Observable<string | undefined> {
    return this.auth0.error$.pipe(map((error) => error.message));
  }

  getToken$(): Observable<string | null> {
    return this.auth0.user$;
  }
}
