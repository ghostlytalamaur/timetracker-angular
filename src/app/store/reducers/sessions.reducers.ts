import { Status, errorStatus, initialStatus, loadingStatus, successStatus } from '@app/shared/types';
import { SessionEntity } from '@app/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SessionsActions } from '../actions';

export interface State extends EntityState<SessionEntity> {
  readonly status: Status;
  readonly loaded: boolean;
}

export const adapter = createEntityAdapter<SessionEntity>();


function onLoadSessions(state: State): State {
  return {
    ...state,
    status: loadingStatus(state.status ?? initialStatus()),
  };
}

function onSessionsAdded(state: State, { sessions }: ReturnType<typeof SessionsActions.sessionsAdded>): State {
  return {
    ...adapter.addMany(sessions, state),
    loaded: true,
    status: successStatus(state.status),
  };
}

function onSessionsModified(state: State,
                            { sessions }: ReturnType<typeof SessionsActions.sessionsModified>): State {
  return adapter.upsertMany(sessions, state);
}

function onSessionsRemoved(state: State, { ids }: ReturnType<typeof SessionsActions.sessionsRemoved>): State {
  return adapter.removeMany(ids, state);
}

function onSessionsError(state: State, { message }: ReturnType<typeof SessionsActions.sessionsError>): State {
  return {
    ...state,
    status: errorStatus(state.status, message),
  };
}

function onClearError(state: State): State {
  return {
    ...state,
    status: initialStatus(),
  };
}

function onToggleSessionTag(state: State, action: ReturnType<typeof SessionsActions.toggleSessionTag>): State {
  const session = state.entities[action.sessionId];
  if (!session) {
    return state;
  }
  const tags = session.tags;

  return adapter.updateOne({
    id: action.sessionId,
    changes: {
      tags: tags.includes(action.tagId) ? tags.filter(id => id !== action.tagId) : tags.concat(action.tagId),
    },
  }, state);
}

export const initialState: State = adapter.getInitialState<State>({
  ids: [],
  entities: {},
  status: initialStatus(),
  loaded: false,
});

export const reducer = createReducer<State>(initialState,
  on(SessionsActions.loadSessions, onLoadSessions),
  on(SessionsActions.sessionsAdded, onSessionsAdded),
  on(SessionsActions.sessionsModified, onSessionsModified),
  on(SessionsActions.sessionsRemoved, onSessionsRemoved),
  on(SessionsActions.sessionsError, onSessionsError),
  on(SessionsActions.clearError, onClearError),
  on(SessionsActions.toggleSessionTag,
    // on failure tags already in session
    SessionsActions.toggleSessionTagFailure, onToggleSessionTag),
);
