import { adapter, SessionsEntityState } from './entities.state';
import { createSelector, Selector } from '@ngrx/store';
import { isRunning, Session } from '../../model/session';

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors();


const getSessions: Selector<SessionsEntityState, Session[]> = createSelector(
  selectAll,
  entities => entities.map(e => Session.fromEntity(e)).sort((a, b) => a.start.valueOf() - b.start.valueOf())
);

const getRunningSessions: Selector<SessionsEntityState, Session[]> = createSelector(
  getSessions,
  sessions => sessions.filter(isRunning)
);

const hasRunningSessions: Selector<SessionsEntityState, boolean> = createSelector(
  getRunningSessions,
  sessions => sessions.length > 0
);

const getSession: (id: string) => Selector<SessionsEntityState, Session | undefined> =
  (id: string) => createSelector(
    selectEntities,
    entities => {
      const e = entities[id];
      return e && Session.fromEntity(e);
    });

const isLoading: Selector<SessionsEntityState, boolean> =
  state => !!(state.status && state.status.type === 'loading');
const isLoaded: Selector<SessionsEntityState, boolean> =
  state => state.loaded;
const getError: Selector<SessionsEntityState, string> =
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

export function getSelectors<S>(selectState: (state: S) => SessionsEntityState): EntitiesSelectors<S> {
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
