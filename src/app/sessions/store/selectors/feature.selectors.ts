import { createFeatureSelector } from '@ngrx/store';

import * as fromFeature from '../reducers';

export const selectFeatureState = createFeatureSelector<fromFeature.State>(fromFeature.featureKey);
