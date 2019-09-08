import * as fromRoot from '../../core/store';
import { Action, createFeatureSelector, createReducer, createSelector, on, Selector } from '@ngrx/store';
import { SessionEntity } from '../model/session-entity';
import { SessionsActions } from './actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { Session } from '../model/session';

interface LoadingStatus {
  type: 'loading';
}

interface ErrorStatus {
  type: 'error';
  message: string;
}

type Status = LoadingStatus | ErrorStatus;
export const sessionsFeatureKey = 'sessions';

export interface SessionsState extends EntityState<SessionEntity> {
  status: Status | undefined;
  loaded: boolean;
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}

const adapter = createEntityAdapter<SessionEntity>();

const initialState: SessionsState = adapter.getInitialState<SessionsState>({
  ids: [],
  entities: {},
  status: undefined,
  loaded: false
});

function onLoadSessions(state: SessionsState): SessionsState {
  return {
    ...state,
    status: { type: 'loading' }
  };
}

function onSessionsAdded(state: SessionsState, { sessions }: ReturnType<typeof SessionsActions.sessionsAdded>): SessionsState {
  return {
    ...adapter.addMany(sessions, state),
    loaded: true,
    status: undefined
  };
}

function onSessionsModified(state: SessionsState, { sessions }: ReturnType<typeof SessionsActions.sessionsModified>): SessionsState {
  return adapter.upsertMany(sessions, state);
}

function onSessionsRemoved(state: SessionsState, { ids }: ReturnType<typeof SessionsActions.sessionsRemoved>): SessionsState {
  return adapter.removeMany(ids, state);
}

function onSessionsError(state: SessionsState, { message }: ReturnType<typeof SessionsActions.sessionsError>): SessionsState {
  return {
    ...state,
    status: { type: 'error', message }
  };
}

function onClearError(state: SessionsState): SessionsState {
  return {
    ...state,
    status: undefined
  };
}

export const sessionsReducers = createReducer<SessionsState>(initialState,
  on(SessionsActions.loadSessions, onLoadSessions),
  on(SessionsActions.sessionsAdded, onSessionsAdded),
  on(SessionsActions.sessionsModified, onSessionsModified),
  on(SessionsActions.sessionsRemoved, onSessionsRemoved),
  on(SessionsActions.sessionsError, onSessionsError),
  on(SessionsActions.clearError, onClearError)
);

export function reducers(state: SessionsState | undefined, action: Action): SessionsState {
  return sessionsReducers(state, action);
}

const selectSessionsState = createFeatureSelector<SessionsState>(sessionsFeatureKey);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors(selectSessionsState);

export const getSessions: Selector<State, Session[]> = createSelector(
  selectAll,
  entities => entities.map(e => Session.fromEntity(e)).sort((a, b) => a.date.valueOf() - b.date.valueOf())
);

export const getRunningSessions: Selector<State, Session[]> = createSelector(
  getSessions,
  sessions => sessions.filter(s => s.isRunning())
);
export const hasRunningSessions: Selector<State, boolean> = createSelector(
  getRunningSessions,
  sessions => sessions.length > 0
);

export const getSession: (id: string) => Selector<State, Session | undefined> =
  (id: string) => createSelector(
    selectEntities,
    entities => {
      const e = entities[id];
      return e && Session.fromEntity(e);
    });

export const isLoading: Selector<State, boolean> = createSelector(
  selectSessionsState,
  state => !!(state.status && state.status.type === 'loading')
);

export const isLoaded: Selector<State, boolean> = createSelector(
  selectSessionsState,
  state => state.loaded
);

export const getError: Selector<State, string> = createSelector(
  selectSessionsState,
  state => state.status && state.status.type === 'error' ? state.status.message : ''
);
