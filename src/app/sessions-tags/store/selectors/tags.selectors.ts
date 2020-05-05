import { createFeatureSelector } from '@ngrx/store';

import { fromTags } from '../reducers';

const selectTagsFeature = createFeatureSelector<fromTags.State>(fromTags.featureKey);

export const {
  selectAll: selectSessionsTags,
} = fromTags.adapter.getSelectors(selectTagsFeature);
