import * as fromRoot from '../../core/store';
import { Action, createFeatureSelector, createReducer, createSelector, on, Selector } from '@ngrx/store';
import { createSession, Session } from '../model/session';
import { SessionsActions } from './actions';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { v4 as uuid } from 'uuid';

interface LoadingStatus {
  type: 'loading';
}

interface ErrorStatus {
  type: 'error';
  message: string;
}

type Status = LoadingStatus | ErrorStatus;
export const sessionsFeatureKey = 'sessions';

export interface SessionsState extends EntityState<Session> {
  status: Status | undefined;
}

export interface State extends fromRoot.State {
  [sessionsFeatureKey]: SessionsState;
}

const adapter = createEntityAdapter<Session>();

const defaultSession: Session[] = [
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  )
  ,
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  ),
  createSession(uuid(),
    new Date(2019, 1, 1, 8, 0).toString(),
    new Date(2019, 1, 1, 8, 0).toString()
  )
];

const initialState = adapter.getInitialState<SessionsState>({
  ids: defaultSession.map(s => s.id),
  entities: defaultSession.reduce<{ [id: string]: Session }>((acc, s) => {
    acc[s.id] = s;
    return acc;
  }, {}),
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


export const getSessions: Selector<State, Session[]> = selectAll;
export const getRunningSessions: Selector<State, Session[]> = createSelector(
  getSessions,
  sessions => sessions.filter(s => !s.end)
);
export const hasRunningSessions: Selector<State, boolean> = createSelector(
  getRunningSessions,
  sessions => sessions.length > 0
);

export const getSession: (id: string) => Selector<State, Session | undefined> =
  (id: string) => createSelector(
    selectEntities,
    entities => entities[id]
  );
