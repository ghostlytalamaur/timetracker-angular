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

interface State extends EntityState<Session> {
  readonly status: Status;
}
const adapter = createEntityAdapter<Session>();

export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer: createReducer(
    adapter.getInitialState({
      status: initialStatus(),
    }),
    on(sessionActions.changeSession, (state, { changes }) => {
      return adapter.updateOne(changes, state);
    }),
    on(sessionActions.clearSessions, (state) => {
      return adapter.removeAll(state);
    }),
    on(sessionActions.deleteSession, (state, { id }): State => {
      return adapter.removeOne(id, state);
    }),
    on(sessionActions.sessionsDeleted, (state, { ids }): State => {
      return adapter.removeMany(ids, state);
    }),
    on(sessionActions.sessionsChanged, (state, { sessions }) => {
      return adapter.upsertMany(sessions, state);
    }),
    on(sessionActions.loadSessions, (state) => {
      return { ...state, status: loadStatus(state.status) };
    }),
    on(sessionActions.sessionsLoaded, (state, { sessions }) => {
      return adapter.setAll(sessions, {
        ...state,
        status: successStatus(state.status),
      });
    }),
  ),
});

function getActiveSession(state: State): Session | undefined {
  for (const id of state.ids) {
    const session = state.entities[id];
    if (session && isActive(session)) {
      return session;
    }
  }

  return undefined;
}

export const { selectAll: selectSessions } = adapter.getSelectors(
  sessionsFeature.selectSessionsState,
);

export const selectActiveSession = createSelector(
  sessionsFeature.selectSessionsState,
  getActiveSession,
);
