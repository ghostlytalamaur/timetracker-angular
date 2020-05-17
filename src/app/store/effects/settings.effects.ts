import { Injectable } from '@angular/core';
import { LocalStorageService } from '@app/core/services';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import { SettingsActions } from '../actions';
import * as fromFeature from '../reducers';
import { SettingsSelectors } from '../selectors';

@Injectable()
export class SettingsEffects {
  public persistSettings$ = createEffect(() =>
      this.actions$
        .pipe(
          ofType(
            SettingsActions.setDisplayRange,
            SettingsActions.changeGroupType,
            SettingsActions.changeSortType,
          ),
          withLatestFrom(this.store.select(SettingsSelectors.selectSettings)),
          tap(([ignored, settings]) => SettingsEffects.storeSettings(settings)),
        ),
    { dispatch: false },
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
  ) {
  }

  private static storeSettings(settings: fromFeature.fromSettings.State): void {
    LocalStorageService.setItem(fromFeature.featureKey, 'settings', settings);
  }
}
