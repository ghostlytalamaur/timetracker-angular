import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SettingsActions, SettingsState } from './settings';
import { sessionsFeatureKey, settingsKey, State } from './sessions.state';
import { tap, withLatestFrom } from 'rxjs/operators';
import { selectSettings } from './sessions.selectors';
import { LocalStorageService } from '../../core/local-storage.service';

@Injectable()
export class SettingsEffects {
  persistSettings$ = createEffect(() =>
      this.actions$
        .pipe(
          ofType(
            SettingsActions.setDisplayRange,
            SettingsActions.changeGroupType
          ),
          withLatestFrom(this.store.select(selectSettings)),
          tap(([action, settings]) => this.storeSettings(settings))
        ),
    { dispatch: false }
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<State>
  ) {
  }

  private storeSettings(settings: SettingsState): void {
    LocalStorageService.setItem(sessionsFeatureKey, settingsKey, settings);
  }
}
