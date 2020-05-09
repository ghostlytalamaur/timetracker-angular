import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import * as fromTags from './tags.reducer';

export const featureKey = 'sessions-store';

export interface State {
  tags: fromTags.State;
}

export const APP_STORE_REDUCERS = new InjectionToken<ActionReducerMap<State>>(
  'App Store Reducers',
  { factory: () => ({
      tags: fromTags.reducer,
    })},
)

export { fromTags };
