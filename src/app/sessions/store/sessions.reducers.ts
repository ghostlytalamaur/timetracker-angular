import { Action, combineReducers, createReducer, on } from '@ngrx/store';
import { SessionsState, settingsKey } from './sessions.state';
import * as fromSettings from './settings';
import { SettingsActions } from './settings';
import { isInRange } from '../../shared/utils';
import * as fromEntities from './entities';

function onChangeDisplayRange(state: SessionsState, displayRange: ReturnType<typeof SettingsActions.setDisplayRange>): SessionsState {
  return {
    ...state,
    entities: fromEntities.adapter.removeMany(e => !isInRange(e.start, displayRange), state.entities)
  };
}

const initialState: SessionsState = {
  entities: fromEntities.initialState,
  [settingsKey]: fromSettings.initialState
};

const compositeReducer = createReducer<SessionsState>(initialState,
  on(SettingsActions.setDisplayRange, onChangeDisplayRange)
);

const combinedReducer = combineReducers<SessionsState>({
  entities: fromEntities.sessionsReducers,
  [settingsKey]: fromSettings.settingsReducers
});

export function reducers(state: SessionsState | undefined, action: Action): SessionsState {
  return compositeReducer(combinedReducer(state, action), action);
}
