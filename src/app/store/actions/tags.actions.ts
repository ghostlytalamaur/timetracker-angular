import { createAction, props } from '@ngrx/store';

import { SessionTag } from '../models';

export const loadTags = createAction(
  '[Sessions Tags] Load Tags',
);

export const loadTagsSuccess = createAction(
  '[Sessions Tags] Load Tags Success',
  props<{ tags: SessionTag[] }>(),
);

export const saveTag = createAction(
  '[Sessions Tags] Add Tag',
  props<{ tag: SessionTag }>(),
)

export const deleteTag = createAction(
  '[Sessions Tags] Delete Tag',
  props<{ id: string }>(),
)
