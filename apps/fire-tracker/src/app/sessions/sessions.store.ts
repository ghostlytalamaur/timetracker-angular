import { createEntityAdapter, EntityState } from '@ngrx/entity';
import {
  createActionGroup,
  createFeature,
  createReducer,
  createSelector, emptyProps,
  on,
  props,
} from '@ngrx/store';

export interface Session {
  readonly id: string;
  readonly start: Date;
  readonly durationMs: number;
  readonly description: string;
}

export const sessionActions = createActionGroup({
  source: 'Sessions',
  events: {
    'Start Session': props<{ session: Session }>(),
    'Stop Session': props<{ id: string; durationMs: number }>(),
    'Sessions Changed': props<{ sessions: Session[] }>(),
    'Sessions Loaded': props<{ sessions: Session[] }>(),
    'Clear Sessions': emptyProps(),
  },
});

type State = EntityState<Session>;
const adapter = createEntityAdapter<Session>();

export const sessionsFeature = createFeature({
  name: 'sessions',
  reducer: createReducer(
    adapter.getInitialState(),
    on(sessionActions.clearSessions, (state) => {
      return adapter.removeAll(state);
    }),
    on(sessionActions.sessionsChanged, (state, { sessions }) => {
      return adapter.upsertMany(sessions, state);
    }),
    on(sessionActions.sessionsLoaded, (state, { sessions }) => {
      return adapter.setAll(sessions, state);
    }),
  ),
});

function getActiveSession(state: State): Session | undefined {
  for (const id of state.ids) {
    const session = state.entities[id];
    if (session && session.durationMs < 0) {
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
