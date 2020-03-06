import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';

import { LocalStorageService } from '../../../core/local-storage.service';
import { SettingsActions } from '../actions';
import { fromSessionsFeature, fromSettings } from '../reducers';
import { selectSettings } from '../selectors/feature.selectors';

@Injectable()
export class SettingsEffects {
  persistSettings$ = createEffect(() =>
      this.actions$
        .pipe(
          ofType(
            SettingsActions.setDisplayRange,
            SettingsActions.changeGroupType,
            SettingsActions.changeSortType,
          ),
          withLatestFrom(this.store.select(selectSettings)),
          tap(([ignored, settings]) => SettingsEffects.storeSettings(settings)),
        ),
    { dispatch: false },
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<object>,
  ) {
  }

  private static storeSettings(settings: fromSettings.SettingsState): void {
    LocalStorageService.setItem(fromSessionsFeature.sessionsFeatureKey, fromSessionsFeature.settingsKey, settings);
  }
}
