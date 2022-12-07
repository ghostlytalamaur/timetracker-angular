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
import { Session, SessionsGroup } from './session';

export const sessionActions = createActionGroup({
  source: 'Sessions',
  events: {
    'Start Session': props<{ start: Date; description: string }>(),
    'Stop Session': props<{ durationMs: number }>(),
    'Change Session': props<{ changes: Update<Session> }>(),
    'Delete Session': props<{ id: string }>(),
    'Sessions Changed': props<{ sessions: Session[] }>(),
    'Load Sessions': emptyProps(),
    'Sessions Loaded': props<{ sessions: Session[] }>(),
    'Active Session Loaded': props<{ session: Session | undefined }>(),
    'Change Active Session': props<{ description: string }>(),
    'Sessions Deleted': props<{ ids: string[] }>(),
    'Clear Sessions': emptyProps(),
  },
});

interface State {
  readonly activeSession: Session | undefined;
  readonly sessions: EntityState<Session>;
  readonly status: Status;
}

const adapter = createEntityAdapter<Session>();
const defaults: State = {
  activeSession: undefined,
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
    on(sessionActions.sessionsChanged, (state, { sessions }): State => {
      return { ...state, sessions: adapter.upsertMany(sessions, state.sessions) };
    }),
    on(sessionActions.loadSessions, (state): State => {
      return { ...state, status: loadStatus() };
    }),
    on(sessionActions.activeSessionLoaded, (state, { session }): State => {
      return {
        ...state,
        activeSession: session,
      };
    }),
    on(sessionActions.sessionsLoaded, (state, { sessions }): State => {
      return {
        ...state,
        status: successStatus(),
        sessions: adapter.setAll(sessions, state.sessions),
      };
    }),
  ),
});

export const { selectAll: selectSessions } = adapter.getSelectors(sessionsFeature.selectSessions);

export const selectActiveSession = sessionsFeature.selectActiveSession;

export const selectSessionsGroups = createSelector(selectSessions, (sessions) => {
  const groups = new Array<SessionsGroup>();
  const idToGroup = new Map<string, SessionsGroup>();
  for (const session of sessions) {
    const id = `${
      session.start.getFullYear() - session.start.getMonth() - session.start.getDate()
    }`;
    let group = idToGroup.get(id);
    if (!group) {
      group = {
        id,
        date: session.start,
        sessions: [],
      };
      groups.push(group);
      idToGroup.set(id, group);
    }
    group.sessions.push(session);
  }

  return groups.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
});
