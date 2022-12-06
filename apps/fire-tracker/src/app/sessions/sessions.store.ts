import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector,
  emptyProps,
  on,
  props,
} from '@ngrx/store';
import { initialStatus, loadStatus, Status, successStatus } from '../models/status';
import { isActive, Session } from './session';

export const sessionActions = createActionGroup({
  source: 'Sessions',
  events: {
    'Start Session': props<{ start: Date }>(),
    'Change Session': props<{ changes: Update<Session> }>(),
    'Delete Session': props<{ id: string }>(),
    'Sessions Changed': props<{ sessions: Session[] }>(),
    'Load Sessions': emptyProps(),
    'Sessions Loaded': props<{ sessions: Session[] }>(),
    'Sessions Deleted': props<{ ids: string[] }>(),
    'Clear Sessions': emptyProps(),
  },
});

interface State {
  readonly sessions: EntityState<Session>;
  readonly status: Status;
}

const adapter = createEntityAdapter<Session>();
const defaults: State = {
  sessions: adapter.getInitialState(),
  status: initialStatus(),
};
export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer: createReducer(
    defaults,
    on(sessionActions.changeSession, (state, { changes }) => {
      return { ...state, sessions: adapter.updateOne(changes, state.sessions) };
    }),
    on(sessionActions.clearSessions, (state) => {
      return { ...state, sessions: adapter.removeAll(state.sessions) };
    }),
    on(sessionActions.deleteSession, (state, { id }): State => {
      return { ...state, sessions: adapter.removeOne(id, state.sessions) };
    }),
    on(sessionActions.sessionsDeleted, (state, { ids }): State => {
      return { ...state, sessions: adapter.removeMany(ids, state.sessions) };
    }),
    on(sessionActions.sessionsChanged, (state, { sessions }) => {
      return { ...state, sessions: adapter.upsertMany(sessions, state.sessions) };
    }),
    on(sessionActions.loadSessions, (state) => {
      return { ...state, status: loadStatus(state.status) };
    }),
    on(sessionActions.sessionsLoaded, (state, { sessions }) => {
      return {
        status: successStatus(state.status),
        sessions: adapter.setAll(sessions, state.sessions),
      };
    }),
  ),
});

function getActiveSession(state: EntityState<Session>): Session | undefined {
  for (const id of state.ids) {
    const session = state.entities[id];
    if (session && isActive(session)) {
      return session;
    }
  }

  return undefined;
}

export const { selectAll: selectSessions } = adapter.getSelectors(sessionsFeature.selectSessions);

export const selectActiveSession = createSelector(sessionsFeature.selectSessions, getActiveSession);
