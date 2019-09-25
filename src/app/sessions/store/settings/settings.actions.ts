import { createAction, props } from '@ngrx/store';
import { SessionsGroupType } from '../../model/sessions-group';

export const setDisplayRange = createAction(
  '[Sessions] Set Display Range',
  props<{ start: number, end: number }>()
);

export const changeGroupType = createAction(
  '[Sessions] Change Group Type',
  props<{ group: SessionsGroupType }>()
);
