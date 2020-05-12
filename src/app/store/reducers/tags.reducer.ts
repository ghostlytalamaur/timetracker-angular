import { Status, errorStatus, initialStatus, isInitialStatus, loadingStatus, successStatus } from '@app/shared/types';
import { SessionTag } from '@app/store';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SessionsTagsActions } from '../actions';

export interface State extends EntityState<SessionTag> {
  status: Status;
}

export const adapter = createEntityAdapter<SessionTag>();

const initialState = adapter.getInitialState<State>({
  ids: [],
  entities: {},
  status: initialStatus(),
});

export const reducer = createReducer(
  initialState,
  on(SessionsTagsActions.requestTags, (state) => {
    if (isInitialStatus(state.status)) {
      return {
        ...state,
        status: loadingStatus(state.status),
      }
    }

    return state;
  }),

  on(SessionsTagsActions.cancelRequestTags, () => initialState),

  on(SessionsTagsActions.tagsAdded, (state, { tags }) => {
    return adapter.upsertMany(tags, {
      ...state,
      status: successStatus(state.status),
    });
  }),

  on(SessionsTagsActions.tagsModified, (state, { tags }) => adapter.upsertMany(tags, state)),

  on(SessionsTagsActions.tagsDeleted, (state, { ids }) => adapter.removeMany(ids, state)),

  on(SessionsTagsActions.tagsError, (state, { message }) => {
    return {
      ...state,
      status: errorStatus(state.status, message),
    };
  }),
  )
;
