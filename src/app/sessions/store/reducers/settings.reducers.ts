import { DateTime } from 'luxon';
import { createReducer, on } from '@ngrx/store';
import { SessionsGroupType, SortType } from '../../models';
import { SettingsActions } from '../actions';
import { Range } from '../../../shared/utils';

export interface SettingsState {
  readonly displayRange: Range<number>;
  readonly groupType: SessionsGroupType;
  readonly sortType: SortType;
}

function onSetDisplayRange(state: SettingsState, displayRange: ReturnType<typeof SettingsActions.setDisplayRange>): SettingsState {
  return {
    ...state,
    displayRange: { start: displayRange.start, end: displayRange.end },
  };
}

function onChangeGroupType(state: SettingsState, group: ReturnType<typeof SettingsActions.changeGroupType>): SettingsState {
  return {
    ...state,
    groupType: group.group,
  };
}

function onChangeSortType(state: SettingsState, sortType: ReturnType<typeof SettingsActions.changeSortType>): SettingsState {
  return {
    ...state,
    sortType: sortType.sortType,
  };
}

export const initialState: SettingsState = {
  displayRange: {
    start: DateTime.local().startOf('month').valueOf(),
    end: DateTime.local().endOf('month').valueOf(),
  },
  groupType: 'none',
  sortType: 'desc',
};

export const settingsReducers = createReducer<SettingsState>(initialState,
  on(SettingsActions.setDisplayRange, onSetDisplayRange),
  on(SettingsActions.changeGroupType, onChangeGroupType),
  on(SettingsActions.changeSortType, onChangeSortType),
);
