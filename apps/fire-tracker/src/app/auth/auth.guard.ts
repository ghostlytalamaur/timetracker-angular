import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map, switchMap, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { authFeature } from './auth.store';

export const isSignedIn: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return store.select(authFeature.selectInSilentSignIn).pipe(
    filter((value) => !value),
    take(1),
    switchMap(() => store.select(authFeature.selectUser)),
    map((user) => {
      if (user) {
        return true;
      }

      return router.createUrlTree(['/login']);
    }),
  );
};
