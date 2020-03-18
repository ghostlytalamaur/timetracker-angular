import { compose, createFeatureSelector } from '@ngrx/store';

import { fromSessionsFeature } from '../reducers';

import * as SessionsSelectors from './sessions.selectors';
import * as SettingsSelectors from './settings.selectors';

const selectSessionsState = createFeatureSelector<fromSessionsFeature.SessionsState>(fromSessionsFeature.sessionsFeatureKey);

const selectSessionsEntityState = compose(
  state => state.entities,
  selectSessionsState,
);

export const selectSettings = compose(
  state => state.settings,
  selectSessionsState,
);

export const {
  getDisplayRange,
  getGroupType,
  getSortType,
} = SettingsSelectors.getSelectors(selectSettings);

export const {
  getSessions,
  getRunningSessions,
  hasRunningSessions,
  getSession,
  getError,
  isLoading,
  isLoaded,
} = SessionsSelectors.getSelectors(selectSessionsEntityState);
