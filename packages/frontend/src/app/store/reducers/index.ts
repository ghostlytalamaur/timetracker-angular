import { Action, combineReducers } from '@ngrx/store';

import * as fromSessions from './sessions.reducers';
import * as fromSettings from './settings.reducers';
import * as fromTags from './tags.reducer';

export const featureKey = 'sessions-store';

export interface State {
  sessions: fromSessions.State;
  settings: fromSettings.State;
  tags: fromTags.State;
}

export const combinedReducer = combineReducers<State>({
  sessions: fromSessions.reducer,
  settings: fromSettings.reducer,
  tags: fromTags.reducer,
});

export function reducer(state: State | undefined, action: Action): State {
  return combinedReducer(state, action);
}

export { fromTags, fromSessions, fromSettings };
