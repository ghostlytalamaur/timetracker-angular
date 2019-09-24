import { Action, createReducer, on } from '@ngrx/store';
import { SessionsActions } from './actions';
import { isInRange } from '../../shared/utils';
import { adapter, SessionsState } from './sessions.state';
import { DateTime } from 'luxon';

function onLoadSessions(state: SessionsState): SessionsState {
  return {
    ...state,
    status: { type: 'loading' }
  };
}

function onSessionsAdded(state: SessionsState, { sessions }: ReturnType<typeof SessionsActions.sessionsAdded>): SessionsState {
  return {
    ...adapter.addMany(sessions, state),
    loaded: true,
    status: undefined
  };
}

function onSessionsModified(state: SessionsState, { sessions }: ReturnType<typeof SessionsActions.sessionsModified>): SessionsState {
  return adapter.upsertMany(sessions, state);
}

function onSessionsRemoved(state: SessionsState, { ids }: ReturnType<typeof SessionsActions.sessionsRemoved>): SessionsState {
  return adapter.removeMany(ids, state);
}

function onSessionsError(state: SessionsState, { message }: ReturnType<typeof SessionsActions.sessionsError>): SessionsState {
  return {
    ...state,
    status: { type: 'error', message }
  };
}

function onClearError(state: SessionsState): SessionsState {
  return {
    ...state,
    status: undefined
  };
}

function onSetDisplayRange(state: SessionsState, displayRange: ReturnType<typeof SessionsActions.setDisplayRange>): SessionsState {
  return adapter.removeMany(e => !isInRange(e.start, displayRange), {
    ...state,
    displayRange: { start: displayRange.start, end: displayRange.end }
  });
}

function onChangeGroupType(state: SessionsState, group: ReturnType<typeof SessionsActions.changeGroupType>): SessionsState {
  return {
    ...state,
    groupType: group.group
  };
}

const initialState: SessionsState = adapter.getInitialState<SessionsState>({
  ids: [],
  entities: {},
  displayRange: {
    start: DateTime.local().startOf('month').valueOf(),
    end: DateTime.local().endOf('month').valueOf()
  },
  groupType: 'none',
  status: undefined,
  loaded: false
});

export const sessionsReducers = createReducer<SessionsState>(initialState,
  on(SessionsActions.loadSessions, onLoadSessions),
  on(SessionsActions.sessionsAdded, onSessionsAdded),
  on(SessionsActions.sessionsModified, onSessionsModified),
  on(SessionsActions.sessionsRemoved, onSessionsRemoved),
  on(SessionsActions.sessionsError, onSessionsError),
  on(SessionsActions.clearError, onClearError),
  on(SessionsActions.setDisplayRange, onSetDisplayRange),
  on(SessionsActions.changeGroupType, onChangeGroupType)
);

export function reducers(state: SessionsState | undefined, action: Action): SessionsState {
  return sessionsReducers(state, action);
}
