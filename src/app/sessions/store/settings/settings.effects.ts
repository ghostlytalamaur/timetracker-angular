import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { SettingsState } from './settings.state';
import { State } from '../sessions.state';

@Injectable()
export class SettingsEffects {
  // settingsChanged$ = createEffect(() =>
  //   this.store.select(selectSettings)
  //     .pipe(
  //       tap(settings => this.storeSettings(settings))
  //     ),
  //   { dispatch: false }
  // );

  constructor(
    private readonly actions: Actions,
    private readonly store: Store<State>
  ) {
  }

  private storeSettings(settings: SettingsState): void {
    localStorage.setItem('sessions_settings', JSON.stringify(settings));
  }
}
