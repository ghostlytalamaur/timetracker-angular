import { createAction, props } from '@ngrx/store';
import { UpdateStr } from '@ngrx/entity/src/models';
import { SessionEntity } from '../../model/session-entity';

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
  props<{ changes: UpdateStr<SessionEntity> }>()
);

export const updateSessions = createAction(
  '[Sessions] Update Session',
  props<{ changes: UpdateStr<SessionEntity>[] }>()
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
