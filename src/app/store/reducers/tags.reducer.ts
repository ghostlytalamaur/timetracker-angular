import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SessionsTagsActions } from '../actions';
import { SessionTag, Status, StatusCode, errorStatus, initialStatus, loadingStatus, successStatus } from '../models';

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
    if (state.status.type === StatusCode.Initial) {
      return {
        ...state,
        status: loadingStatus(),
      }
    } else {
      return state;
    }
  }),

  on(SessionsTagsActions.tagsAdded, (state, { tags }) => {
    return adapter.upsertMany(tags, {
      ...state,
      status: successStatus(),
    });
  }),

  on(SessionsTagsActions.tagsModified, (state, { tags }) => adapter.upsertMany(tags, state)),

  on(SessionsTagsActions.tagsDeleted, (state, { ids }) => adapter.removeMany(ids, state)),

  on(SessionsTagsActions.tagsError, (state, { message }) => {
    return {
      ...state,
      status: errorStatus(message),
    };
  }),
);
