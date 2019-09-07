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
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}

const adapter = createEntityAdapter<SessionEntity>();


const initialState = adapter.getInitialState<SessionsState>({
  ids: [],
  entities: {},
  status: undefined
});

export const sessionsReducers = createReducer<SessionsState>(initialState,
  on(SessionsActions.sessionsAdded, (state, { sessions }) => adapter.addMany(sessions, state)),
  on(SessionsActions.sessionsModified, (state, { sessions }) => adapter.upsertMany(sessions, state)),
  on(SessionsActions.sessionsRemoved, (state, { ids }) => adapter.removeMany(ids, state))
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
  entities => entities.map(e => Session.fromEntity(e))
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
