import { compose } from '@ngrx/store';

import { selectFeatureState } from './feature.selectors';

export const selectSessionsTableState = compose(
  state => state.table,
  selectFeatureState,
);

export const selectExpandedNodes = compose(
  state => state.expandedNodes,
  selectSessionsTableState,
);
