import { compose, createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import { adapter, sessionsFeatureKey, SessionsState, State } from './sessions.state';
import { clustering, Range } from '../../shared/utils';
import { DateTime } from 'luxon';
import { isRunning, Session } from '../model/session';
import { createGroup, SessionsGroup, SessionsGroupType } from '../model/sessions-group';

const selectSessionsState = createFeatureSelector<SessionsState>(sessionsFeatureKey);

const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal
} = adapter.getSelectors(selectSessionsState);

export const selectDisplayRange: Selector<State, Range<number>> = compose(
  state => state.displayRange,
  selectSessionsState
);

export const getDisplayRange: Selector<State, Range<DateTime>> = createSelector(
  selectDisplayRange,
  range => ({ start: DateTime.fromMillis(range.start), end: DateTime.fromMillis(range.end) })
);

export const getSessions: Selector<State, Session[]> = createSelector(
  selectAll,
  entities => entities.map(e => Session.fromEntity(e)).sort((a, b) => a.start.valueOf() - b.start.valueOf())
);

export const getRunningSessions: Selector<State, Session[]> = createSelector(
  getSessions,
  sessions => sessions.filter(isRunning)
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

export const getGroupType: Selector<State, SessionsGroupType> = createSelector(
  selectSessionsState,
  state => state.groupType
);

export const getSessionsGroups: Selector<State, SessionsGroup[]> = createSelector(
  getSessions,
  getGroupType,
  (sessions, groupType) => {
    const getSessionId: (session: Session) => string = session => {
      switch (groupType) {
        case 'none':
          return session.id;
        case 'day':
          return `${session.start.year}-${session.start.month}-${session.start.day}`;
        case 'week':
          return `${session.start.year}-${session.start.weekNumber}`;
        case 'month':
          return `${session.start.year}-${session.start.month}`;
        case 'year':
          return `${session.start.year}`;
      }
    };

    const clusters = clustering(sessions, getSessionId);
    return clusters.map(cluster => {
      const date = cluster.reduce((min, session) => session.start < min ? session.start : min, cluster[0].start);
      return createGroup(getSessionId(cluster[0]), groupType, date, cluster);
    });
  }
);
