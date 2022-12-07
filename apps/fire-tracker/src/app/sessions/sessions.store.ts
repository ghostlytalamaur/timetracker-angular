import { createEntityAdapter, EntityState, Update } from '@ngrx/entity';
import { createAction, createFeature, createReducer, createSelector, on, props } from '@ngrx/store';
import { initialStatus, loadStatus, Status, successStatus } from '../models/status';
import { Session, SessionsGroup } from './session';

export const sessionActions = {
  startSession: createAction(
    '[Sessions] Start Session',
    props<{ start: Date; description: string }>(),
  ),
  stopSession: createAction('[Sessions] Stop Session', props<{ durationMs: number }>()),
  changeSession: createAction('[Sessions] Change Session', props<{ changes: Update<Session> }>()),
  deleteSession: createAction('[Sessions] Delete Session', props<{ id: string }>()),
  loadSessions: createAction('[Sessions] Load Sessions'),
  sessionsLoaded: createAction('[Sessions] Sessions Loaded', props<{ sessions: Session[] }>()),
  activeSessionLoaded: createAction(
    '[Sessions] Active Session Loaded',
    props<{ session: Session | undefined }>(),
  ),
  changeActiveSession: createAction(
    '[Sessions] Change Active Session',
    props<{ description: string }>(),
  ),
  discardActiveSession: createAction('[Sessions] Discard Active Session'),
  clearSessions: createAction('[Sessions] Clear Sessions'),
};

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
