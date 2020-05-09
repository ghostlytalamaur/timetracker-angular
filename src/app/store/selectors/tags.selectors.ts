import { compose } from '@ngrx/store';

import { fromTags } from '../reducers';

import { selectStoreFeature } from './feature.selectors';

const selectTags = compose(
  state => state.tags,
  selectStoreFeature,
)

export const {
  selectAll: selectSessionsTags,
} = fromTags.adapter.getSelectors(selectTags);
