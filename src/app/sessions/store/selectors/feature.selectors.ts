import { compose, createFeatureSelector, createSelector, Selector } from '@ngrx/store';
import { clustering } from '../../../shared/utils';
import { createGroup, Session, SessionsGroup } from '../../models';
import { fromSessionsFeature } from '../reducers';

import * as SettingsSelectors from './settings.selectors';
import * as SessionsSelectors from './sessions.selectors';

const selectSessionsState = createFeatureSelector<fromSessionsFeature.SessionsState>(fromSessionsFeature.sessionsFeatureKey);

const selectSessionsEntityState = compose(
  state => state.entities,
  selectSessionsState
);

export const selectSettings = compose(
  state => state.settings,
  selectSessionsState
);

export const {
  getDisplayRange,
  getGroupType,
  getSortType
} = SettingsSelectors.getSelectors(selectSettings);

export const {
  getSessions,
  getRunningSessions,
  hasRunningSessions,
  getSession,
  getError,
  isLoading,
  isLoaded
} = SessionsSelectors.getSelectors(selectSessionsEntityState);


export const getSessionsGroups: Selector<fromSessionsFeature.State, SessionsGroup[]> = createSelector(
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
