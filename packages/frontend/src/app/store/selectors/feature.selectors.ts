import { createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const selectStoreFeature = createFeatureSelector<fromFeature.State>(fromFeature.featureKey);
