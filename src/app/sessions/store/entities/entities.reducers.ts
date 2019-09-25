import { createReducer, on } from '@ngrx/store';
import * as SessionsActions from './entities.actions';
import { adapter, SessionsEntityState } from './entities.state';

function onLoadSessions(state: SessionsEntityState): SessionsEntityState {
  return {
    ...state,
    status: { type: 'loading' }
  };
}

function onSessionsAdded(state: SessionsEntityState, { sessions }: ReturnType<typeof SessionsActions.sessionsAdded>): SessionsEntityState {
  return {
    ...adapter.addMany(sessions, state),
    loaded: true,
    status: undefined
  };
}

function onSessionsModified(state: SessionsEntityState,
                            { sessions }: ReturnType<typeof SessionsActions.sessionsModified>): SessionsEntityState {
  return adapter.upsertMany(sessions, state);
}

function onSessionsRemoved(state: SessionsEntityState, { ids }: ReturnType<typeof SessionsActions.sessionsRemoved>): SessionsEntityState {
  return adapter.removeMany(ids, state);
}

function onSessionsError(state: SessionsEntityState, { message }: ReturnType<typeof SessionsActions.sessionsError>): SessionsEntityState {
  return {
    ...state,
    status: { type: 'error', message }
  };
}

function onClearError(state: SessionsEntityState): SessionsEntityState {
  return {
    ...state,
    status: undefined
  };
}

export const initialState: SessionsEntityState = adapter.getInitialState<SessionsEntityState>({
  ids: [],
  entities: {},
  status: undefined,
  loaded: false
});

export const sessionsReducers = createReducer<SessionsEntityState>(initialState,
  on(SessionsActions.loadSessions, onLoadSessions),
  on(SessionsActions.sessionsAdded, onSessionsAdded),
  on(SessionsActions.sessionsModified, onSessionsModified),
  on(SessionsActions.sessionsRemoved, onSessionsRemoved),
  on(SessionsActions.sessionsError, onSessionsError),
  on(SessionsActions.clearError, onClearError),
);
