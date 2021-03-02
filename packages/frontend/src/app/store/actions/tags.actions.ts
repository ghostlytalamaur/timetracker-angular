import { createAction, props } from '@ngrx/store';

import { SessionTag } from '../models';

export const requestTags = createAction(
  '[Sessions Tags] Request Tags',
);

export const cancelRequestTags = createAction(
  '[Sessions Tags] Cancel Request Tags',
);

export const tagsError = createAction(
  '[Sessions Tags] Error',
  props<{ message: string }>(),
);
export const tagsAdded = createAction(
  '[Sessions Tags] Tags Added',
  props<{ tags: SessionTag[] }>(),
);

export const tagsModified = createAction(
  '[Sessions Tags] Tags Modified',
  props<{ tags: SessionTag[] }>(),
);

export const tagsDeleted = createAction(
  '[Sessions Tags] Tags Deleted',
  props<{ ids: string[] }>(),
);

export const saveTag = createAction(
  '[Sessions Tags] Add Tag',
  props<{ tag: SessionTag }>(),
);

export const deleteTag = createAction(
  '[Sessions Tags] Delete Tag',
  props<{ id: string }>(),
);
