import { createAction, props } from '@ngrx/store';
import { SessionsGroupType } from '../../model/sessions-group';
import { SortType } from './settings.state';

export const setDisplayRange = createAction(
  '[Sessions] Set Display Range',
  props<{ start: number, end: number }>()
);

export const changeGroupType = createAction(
  '[Sessions] Change Group Type',
  props<{ group: SessionsGroupType }>()
);

export const changeSortType = createAction(
  '[Sessions] Change Sort Type',
  props<{ sortType: SortType }>()
);
