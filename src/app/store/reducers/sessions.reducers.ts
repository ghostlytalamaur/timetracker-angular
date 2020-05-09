import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SessionsActions } from '../actions';
import { SessionEntity } from '../models';

export interface LoadingStatus {
  type: 'loading';
}

export interface ErrorStatus {
  type: 'error';
  message: string;
}

type Status = LoadingStatus | ErrorStatus;

export interface State extends EntityState<SessionEntity> {
  readonly status: Status | undefined;
  readonly loaded: boolean;
}

export const adapter = createEntityAdapter<SessionEntity>();


function onLoadSessions(state: State): State {
  return {
    ...state,
    status: { type: 'loading' },
  };
}

function onSessionsAdded(state: State, { sessions }: ReturnType<typeof SessionsActions.sessionsAdded>): State {
  return {
    ...adapter.addMany(sessions, state),
    loaded: true,
    status: undefined,
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
    status: { type: 'error', message },
  };
}

function onClearError(state: State): State {
  return {
    ...state,
    status: undefined,
  };
}

export const initialState: State = adapter.getInitialState<State>({
  ids: [],
  entities: {},
  status: undefined,
  loaded: false,
});

export const reducer = createReducer<State>(initialState,
  on(SessionsActions.loadSessions, onLoadSessions),
  on(SessionsActions.sessionsAdded, onSessionsAdded),
  on(SessionsActions.sessionsModified, onSessionsModified),
  on(SessionsActions.sessionsRemoved, onSessionsRemoved),
  on(SessionsActions.sessionsError, onSessionsError),
  on(SessionsActions.clearError, onClearError),
);
