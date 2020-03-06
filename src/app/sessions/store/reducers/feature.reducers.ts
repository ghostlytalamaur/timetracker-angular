import { Action, combineReducers, createReducer, on } from '@ngrx/store';

import * as fromRoot from '../../../core/store';
import { isInRange } from '../../../shared/utils';
import { SettingsActions } from '../actions';

import * as fromSessions from './sessions.reducers';
import * as fromSettings from './settings.reducers';


export const settingsKey = 'settings';
export const sessionsFeatureKey = 'sessions';

export interface SessionsState {
  readonly entities: fromSessions.SessionsEntityState;
  readonly [settingsKey]: fromSettings.SettingsState;
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}


function onChangeDisplayRange(state: SessionsState, displayRange: ReturnType<typeof SettingsActions.setDisplayRange>): SessionsState {
  return {
    ...state,
    entities: fromSessions.adapter.removeMany(e => !isInRange(e.start, displayRange), state.entities),
  };
}

const initialState: SessionsState = {
  entities: fromSessions.initialState,
  [settingsKey]: fromSettings.initialState,
};

const compositeReducer = createReducer<SessionsState>(initialState,
  on(SettingsActions.setDisplayRange, onChangeDisplayRange),
);

const combinedReducer = combineReducers<SessionsState>({
  entities: fromSessions.sessionsReducers,
  [settingsKey]: fromSettings.settingsReducers,
});

export function reducers(state: SessionsState | undefined, action: Action): SessionsState {
  return compositeReducer(combinedReducer(state, action), action);
}
