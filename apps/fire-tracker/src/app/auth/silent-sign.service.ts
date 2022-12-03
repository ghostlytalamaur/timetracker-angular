import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { authActions, authFeature } from './auth.store';
import { Store } from '@ngrx/store';
import { filter, take } from 'rxjs';

export function provideSilentSignIn(): Provider {
  return {
    provide: APP_INITIALIZER,
    useFactory: () => {
      const store = inject(Store);
      return () => {
        store.dispatch(authActions.silentSignIn());

        return store.select(authFeature.selectInSilentSignIn).pipe(
          filter((value) => !value),
          take(1),
        );
      };
    },
    multi: true,
  };
}
