import { inject, Injectable } from '@angular/core';
import { createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { preferencesFeature } from './preferences.store';
import { tap } from 'rxjs';
import { DOCUMENT } from '@angular/common';

// noinspection JSUnusedGlobalSymbols
@Injectable()
export class PreferencesEffects {
  private readonly dom = inject(DOCUMENT);
  private readonly store = inject(Store);

  public readonly onSetDarkMode = createEffect(
    () => {
      return this.store.select(preferencesFeature.selectDarkMode).pipe(
        tap((darkMode) => {
          if (darkMode) {
            this.dom.documentElement.classList.add('dark');
          } else {
            this.dom.documentElement.classList.remove('dark');
          }
        }),
      );
    },
    { dispatch: false },
  );
}
