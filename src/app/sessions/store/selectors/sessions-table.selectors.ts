import { compose } from '@ngrx/store';

import { selectSessionsState } from './feature.selectors';

export const selectSessionsTableState = compose(
  state => state.table,
  selectSessionsState,
);

export const selectExpandedNodes = compose(
  state => state.expandedNodes,
  selectSessionsTableState,
);
