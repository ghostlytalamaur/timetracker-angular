import { SettingsState } from './settings.state';
import { createSelector, Selector } from '@ngrx/store';
import { Range } from '../../../shared/utils';
import { DateTime } from 'luxon';
import { SessionsGroupType } from '../../model/sessions-group';


const selectDisplayRange: Selector<SettingsState, Range<number>> = state => state.displayRange;

export const getDisplayRange: Selector<SettingsState, Range<DateTime>> = createSelector(
  selectDisplayRange,
  range => ({ start: DateTime.fromMillis(range.start), end: DateTime.fromMillis(range.end) })
);

export const getGroupType: Selector<SettingsState, SessionsGroupType> = state => state.groupType;

interface SettingsSelectors<S> {
  getGroupType: Selector<S, SessionsGroupType>;
  getDisplayRange: Selector<S, Range<DateTime>>;
}

export function getSelectors<S>(selectState: (state: S) => SettingsState): SettingsSelectors<S> {
  return {
    getDisplayRange: createSelector(selectState, getDisplayRange),
    getGroupType: createSelector(selectState, getGroupType)
  };
}
