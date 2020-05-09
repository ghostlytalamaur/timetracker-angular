import { createReducer, on } from '@ngrx/store';
import { DateTime } from 'luxon';

import { Range } from '../../shared/utils';
import { SettingsActions } from '../actions';
import { SessionsGroupType, SortType } from '../models';

export interface State {
  readonly displayRange: Range<number>;
  readonly groupType: SessionsGroupType;
  readonly sortType: SortType;
}

function onSetDisplayRange(state: State, displayRange: ReturnType<typeof SettingsActions.setDisplayRange>): State {
  return {
    ...state,
    displayRange: { start: displayRange.start, end: displayRange.end },
  };
}

function onChangeGroupType(state: State, group: ReturnType<typeof SettingsActions.changeGroupType>): State {
  return {
    ...state,
    groupType: group.group,
  };
}

function onChangeSortType(state: State, sortType: ReturnType<typeof SettingsActions.changeSortType>): State {
  return {
    ...state,
    sortType: sortType.sortType,
  };
}

export const initialState: State = {
  displayRange: {
    start: DateTime.local().startOf('month').valueOf(),
    end: DateTime.local().endOf('month').valueOf(),
  },
  groupType: 'none',
  sortType: 'desc',
};

export const reducer = createReducer<State>(initialState,
  on(SettingsActions.setDisplayRange, onSetDisplayRange),
  on(SettingsActions.changeGroupType, onChangeGroupType),
  on(SettingsActions.changeSortType, onChangeSortType),
);
