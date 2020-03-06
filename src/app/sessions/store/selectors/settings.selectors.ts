import { Selector, createSelector } from '@ngrx/store';
import { DateTime } from 'luxon';

import { Range } from '../../../shared/utils';
import { SessionsGroupType, SortType } from '../../models';
import { fromSettings } from '../reducers';


const selectDisplayRange: Selector<fromSettings.SettingsState, Range<number>> = state => state.displayRange;

export const getDisplayRange: Selector<fromSettings.SettingsState, Range<DateTime>> = createSelector(
  selectDisplayRange,
  range => ({ start: DateTime.fromMillis(range.start), end: DateTime.fromMillis(range.end) }),
);

export const getGroupType: Selector<fromSettings.SettingsState, SessionsGroupType> = state => state.groupType;
export const getSortType: Selector<fromSettings.SettingsState, SortType> = state => state.sortType;

interface SettingsSelectors<S> {
  getGroupType: Selector<S, SessionsGroupType>;
  getDisplayRange: Selector<S, Range<DateTime>>;
  getSortType: Selector<S, SortType>;
}

export function getSelectors<S>(selectState: (state: S) => fromSettings.SettingsState): SettingsSelectors<S> {
  return {
    getDisplayRange: createSelector(selectState, getDisplayRange),
    getGroupType: createSelector(selectState, getGroupType),
    getSortType: createSelector(selectState, getSortType),
  };
}
