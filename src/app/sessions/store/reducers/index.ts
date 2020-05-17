import { combineReducers } from '@ngrx/store';

import * as fromSessionsTable from './sessions-table.reducer';

export const featureKey = 'sessions-ui';

export interface State {
  readonly table: fromSessionsTable.State,
}

export const reducer = combineReducers<State>({
  table: fromSessionsTable.reducer,
})

export {
  fromSessionsTable,
};
