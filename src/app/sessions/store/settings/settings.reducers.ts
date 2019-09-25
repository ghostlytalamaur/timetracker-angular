import { DateTime } from 'luxon';
import { createReducer, on } from '@ngrx/store';
import { SettingsState } from './settings.state';
import * as SettingsActions from './settings.actions';

function onSetDisplayRange(state: SettingsState, displayRange: ReturnType<typeof SettingsActions.setDisplayRange>): SettingsState {
  return {
    ...state,
    displayRange: { start: displayRange.start, end: displayRange.end }
  };
}

function onChangeGroupType(state: SettingsState, group: ReturnType<typeof SettingsActions.changeGroupType>): SettingsState {
  return {
    ...state,
    groupType: group.group
  };
}

export const initialState: SettingsState = {
  displayRange: {
    start: DateTime.local().startOf('month').valueOf(),
    end: DateTime.local().endOf('month').valueOf()
  },
  groupType: 'none'
};

export const settingsReducers = createReducer<SettingsState>(initialState,
  on(SettingsActions.setDisplayRange, onSetDisplayRange),
  on(SettingsActions.changeGroupType, onChangeGroupType)
);
