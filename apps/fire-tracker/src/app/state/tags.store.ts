import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createAction, createFeature, createReducer, on, props } from '@ngrx/store';
import { initialStatus, loadStatus, Status, successStatus } from '../models/status';
import { Tag } from '../models/tag';

interface State {
  readonly tags: EntityState<Tag>;
  readonly status: Status;
}

const adapter = createEntityAdapter<Tag>();

export interface CreateTagParams {
  readonly caption: string;
  readonly color: string;
}

export const tagsActions = {
  loadTags: createAction('[Tags] Load'),
  loadTagsSuccess: createAction('[Tags] Load Tags Success', props<{ tags: Tag[] }>()),
  clearTags: createAction('[Tags] Clear'),
  createTag: createAction('[Tags] Create Tag', props<{ params: CreateTagParams }>()),
  deleteTag: createAction('[Tags] Delete Tag', props<{ id: string }>()),
};

export const tagsFeature = createFeature({
  name: 'tags',
  reducer: createReducer(
    { tags: adapter.getInitialState(), status: initialStatus() },
    on(tagsActions.loadTags, (state): State => {
      return { ...state, status: loadStatus() };
    }),
    on(tagsActions.loadTagsSuccess, (state, { tags }): State => {
      return {
        ...state,
        status: successStatus(),
        tags: adapter.setAll(tags, state.tags),
      };
    }),
    on(tagsActions.clearTags, (state): State => {
      return { ...state, tags: adapter.removeAll(state.tags), status: initialStatus() };
    }),
  ),
});

export const { selectAll: selectTags } = adapter.getSelectors(tagsFeature.selectTags);
