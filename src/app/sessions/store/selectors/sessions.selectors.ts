import { createSelector, Selector } from '@ngrx/store';
import { isRunning, Session } from '../../models';
import { fromSessions } from '../reducers';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = fromSessions.adapter.getSelectors();


const getSessions: Selector<fromSessions.SessionsEntityState, Session[]> = createSelector(
  selectAll,
  entities => entities.map(e => Session.fromEntity(e)).sort((a, b) => a.start.valueOf() - b.start.valueOf())
);

const getRunningSessions: Selector<fromSessions.SessionsEntityState, Session[]> = createSelector(
  getSessions,
  sessions => sessions.filter(isRunning)
);

const hasRunningSessions: Selector<fromSessions.SessionsEntityState, boolean> = createSelector(
  getRunningSessions,
  sessions => sessions.length > 0
);

const getSession: (id: string) => Selector<fromSessions.SessionsEntityState, Session | undefined> =
  (id: string) => createSelector(
    selectEntities,
    entities => {
      const e = entities[id];
      return e && Session.fromEntity(e);
    });

const isLoading: Selector<fromSessions.SessionsEntityState, boolean> =
  state => !!(state.status && state.status.type === 'loading');
const isLoaded: Selector<fromSessions.SessionsEntityState, boolean> =
  state => state.loaded;
const getError: Selector<fromSessions.SessionsEntityState, string> =
  state => state.status && state.status.type === 'error' ? state.status.message : '';

interface EntitiesSelectors<S> {
  getSessions: Selector<S, Session[]>;
  getRunningSessions: Selector<S, Session[]>;
  hasRunningSessions: Selector<S, boolean>;
  getSession: (id: string) => Selector<S, Session | undefined>;
  isLoading: Selector<S, boolean>;
  isLoaded: Selector<S, boolean>;
  getError: Selector<S, string>;
}

export function getSelectors<S>(selectState: (state: S) => fromSessions.SessionsEntityState): EntitiesSelectors<S> {
  return {
    getSessions: createSelector(selectState, getSessions),
    getRunningSessions: createSelector(selectState, getRunningSessions),
    hasRunningSessions: createSelector(selectState, hasRunningSessions),
    getSession: id => createSelector(selectState, getSession(id)),
    getError: createSelector(selectState, getError),
    isLoaded: createSelector(selectState, isLoaded),
    isLoading: createSelector(selectState, isLoading)
  };
}
