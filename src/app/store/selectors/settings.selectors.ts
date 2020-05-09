import { createSelector } from '@ngrx/store';
import { DateTime } from 'luxon';

import { selectStoreFeature } from './feature.selectors';

const selectSettingsState = createSelector(
  selectStoreFeature,
  state => state.settings,
);

export const selectSettings = selectSettingsState;

const selectDisplayRangeState = createSelector(
  selectSettingsState,
  state => state.displayRange,
);

export const selectDisplayRange = createSelector(
  selectDisplayRangeState,
  range => ({ start: DateTime.fromMillis(range.start), end: DateTime.fromMillis(range.end) }),
);

export const selectGroupType = createSelector(
  selectSettingsState,
  state => state.groupType,
);

export const selectSortType = createSelector(
  selectSettingsState,
  state => state.sortType,
);
