import { compose } from '@ngrx/store';

import { fromTags } from '../reducers';

import { selectStoreFeature } from './feature.selectors';

const selectTagsState = compose(
  state => state.tags,
  selectStoreFeature,
)

export const {
  selectAll: selectSessionsTags,
  selectEntities: selectTagsEntities,
} = fromTags.adapter.getSelectors(selectTagsState);

export const selectStatus = compose(
  state => state.status,
  selectTagsState,
)
