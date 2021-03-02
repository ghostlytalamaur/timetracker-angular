import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable()
export class BaseAuthGuard {

  constructor(
    private readonly authService: AuthService,
    protected readonly router: Router,
  ) {
  }

  protected isSignedIn(): Observable<boolean> {
    return this.authService.isLoading()
      .pipe(
        filter(isLoading => !isLoading),
        switchMap(ignored => this.authService.isSignedIn()),
        take(1),
      );
  }

}

@Injectable({
  providedIn: 'root',
})
export class AuthGuard extends BaseAuthGuard implements CanActivate, CanActivateChild {

  canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.isSignedIn()
      .pipe(
        map(isSignedIn => {
          if (isSignedIn) {
            return true;
          } else {
            return this.router.createUrlTree(['/login']);
          }
        }),
      );
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot,
                          state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canActivate(childRoute, state);
  }

}

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard extends BaseAuthGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot,
                     state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.isSignedIn()
      .pipe(
        map(isSignedIn => {
          if (!isSignedIn) {
            return true;
          } else {
            return this.router.createUrlTree(['/']);
          }
        }),
      );
  }
}
