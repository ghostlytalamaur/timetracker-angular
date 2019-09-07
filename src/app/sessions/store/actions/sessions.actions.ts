import { createAction, props } from '@ngrx/store';
import { SessionEntity } from '../../model/session-entity';
import { Update } from '../../services/fire-entity.service';

export const loadSessions = createAction(
  '[Sessions] Load Sessions'
);

export const addSession = createAction(
  '[Sessions] Add Session',
  props<{ session: SessionEntity }>()
);

export const removeSession = createAction(
  '[Sessions] Remove Session',
  props<{ id: string }>()
);

export const updateSession = createAction(
  '[Sessions] Update Session',
  props<{ changes: Update<SessionEntity> }>()
);

export const updateSessions = createAction(
  '[Sessions] Update Session',
  props<{ changes: Update<SessionEntity>[] }>()
);


export const sessionsAdded = createAction(
  '[Sessions] Sessions Added',
  props<{ sessions: SessionEntity[] }>()
);

export const sessionsModified = createAction(
  '[Sessions] Sessions Modified',
  props<{ sessions: SessionEntity[] }>()
);

export const sessionsRemoved = createAction(
  '[Sessions] Session Removed',
  props<{ ids: string [] }>()
);

export const sessionsError = createAction(
  '[Sessions] Error',
  props<{ message: string }>()
);
