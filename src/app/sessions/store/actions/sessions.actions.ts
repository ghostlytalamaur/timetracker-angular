import { createAction, props } from '@ngrx/store';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Session } from '../../model/session';

export const loadSessions = createAction(
  '[Sessions] Load Sessions'
);

export const addSession = createAction(
  '[Sessions] Add Session',
  props<{ session: Session }>()
);

export const removeSession = createAction(
  '[Sessions] Remove Session',
  props<{ id: string }>()
);

export const updateSession = createAction(
  '[Sessions] Update Session',
  props<{ changes: UpdateStr<Session> }>()
);

export const updateSessions = createAction(
  '[Sessions] Update Session',
  props<{ changes: UpdateStr<Session>[] }>()
);


export const sessionsAdded = createAction(
  '[Sessions] Sessions Added',
  props<{ sessions: Session[] }>()
);

export const sessionsModified = createAction(
  '[Sessions] Sessions Modified',
  props<{ sessions: Session[] }>()
);

export const sessionsRemoved = createAction(
  '[Sessions] Session Removed',
  props<{ ids: string [] }>()
);
