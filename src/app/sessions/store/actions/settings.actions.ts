import { createAction, props } from '@ngrx/store';

import { SessionsGroupType, SortType } from '../../models';

export const setDisplayRange = createAction(
  '[Sessions] Set Display Range',
  props<{ start: number, end: number }>(),
);

export const changeGroupType = createAction(
  '[Sessions] Change Group Type',
  props<{ group: SessionsGroupType }>(),
);

export const changeSortType = createAction(
  '[Sessions] Change Sort Type',
  props<{ sortType: SortType }>(),
);
