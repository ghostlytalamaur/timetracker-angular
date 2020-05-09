import { createSelector } from '@ngrx/store';

import { Session, isRunning } from '../models';
import { fromSessions } from '../reducers';

import { selectStoreFeature } from './feature.selectors';

const selectSessionsState = createSelector(
  selectStoreFeature,
  state => state.sessions,
);

const {
  selectEntities,
  selectAll,
} = fromSessions.adapter.getSelectors(selectSessionsState);

export const selectSessions = createSelector(
  selectAll,
  entities => entities
    .map(e => Session.fromEntity(e))
    .sort((a, b) => a.start.valueOf() - b.start.valueOf()),
);

export const selectRunningSessions = createSelector(
  selectSessions,
  sessions => sessions.filter(isRunning),
);

export const selectHasRunningSessions = createSelector(
  selectRunningSessions,
  sessions => sessions.length > 0,
);

export const selectSession = (id: string) => createSelector(
  selectEntities,
  entities => {
    const e = entities[id];
    return e && Session.fromEntity(e);
  });

export const selectIsLoading = createSelector(
  selectSessionsState,
  state => !!(state.status && state.status.type === 'loading'),
);

export const selectIsLoaded = createSelector(
  selectSessionsState,
  state => state.loaded,
);

export const selectError = createSelector(
  selectSessionsState,
  state => state.status && state.status.type === 'error' ? state.status.message : '',
);
