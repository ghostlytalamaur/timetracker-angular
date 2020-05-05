import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer } from '@ngrx/store';

import { SessionTag } from '../../models';

export interface State extends EntityState<SessionTag>{
}

export const featureKey = 'sessions-tags';
export const adapter = createEntityAdapter<SessionTag>();

const initialState = adapter.getInitialState({
  ids: ['id1', 'id2'],
  entities: {
    id1: {
      id: 'id1',
      label: 'first tag',
    },
    id2: {
      id: 'id2',
      label: 'first tag',
    },
  },
});

export const reducer = createReducer(
  initialState,
);
