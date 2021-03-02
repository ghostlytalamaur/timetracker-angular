import { InjectionToken } from '@angular/core';
import { ActionReducerMap } from '@ngrx/store';

import * as fromTable from './sessions-table.reducer';

export const featureKey = 'sessions-ui';

export interface State {
  readonly table: fromTable.State;
}

export const APP_STORE_REDUCERS = new InjectionToken<ActionReducerMap<State>>(
  'App Store Reducers',
  {
    factory: () => ({
      table: fromTable.reducer,
    }),
  },
);
