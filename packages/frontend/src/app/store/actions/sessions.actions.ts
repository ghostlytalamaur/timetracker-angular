import { createAction, props } from '@ngrx/store';

import { SessionEntity, Update } from '../models';


export const requestSessions = createAction(
  '[Sessions] Request Sessions',
);

export const cancelRequestSessions = createAction(
  '[Sessions] Cancel Request Sessions',
);

export const addSession = createAction(
  '[Sessions] Add Session',
  props<{ session: SessionEntity }>(),
);

export const addSessions = createAction(
  '[Sessions] Add Sessions',
  props<{ sessions: SessionEntity[] }>(),
);

export const removeSessions = createAction(
  '[Sessions] Remove Session',
  props<{ ids: string[] }>(),
);

export const updateSessions = createAction(
  '[Sessions] Update Sessions',
  props<{ changes: Update<SessionEntity>[] }>(),
);

export const sessionsAdded = createAction(
  '[Sessions] Sessions Added',
  props<{ sessions: SessionEntity[] }>(),
);

export const sessionsModified = createAction(
  '[Sessions] Sessions Modified',
  props<{ sessions: SessionEntity[] }>(),
);

export const sessionsRemoved = createAction(
  '[Sessions] Session Removed',
  props<{ ids: string[] }>(),
);

export const sessionsError = createAction(
  '[Sessions] Error',
  props<{ message: string }>(),
);

export const clearError = createAction(
  '[Sessions] Clear Error',
);

export const toggleSessionTag = createAction(
  '[Sessions] Toggle Tag',
  props<{
    sessionId: string;
    tagId: string;
  }>(),
);

export const toggleSessionTagFailure = createAction(
  '[Sessions] Toggle Tag Failure',
  props<{
    sessionId: string;
    tagId: string;
  }>(),
);

export const copyGroupToClipboard = createAction(
  '[Sessions] Copy Group To Clipboard',
  props<{
    groupId: string;
  }>(),
);
