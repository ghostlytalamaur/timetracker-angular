import { createReducer, on } from '@ngrx/store';

import { SessionsTableActions } from '../actions';

export interface State {
  expandedNodes: string[];
}

export const initialState: State = {
  expandedNodes: [],
};

export const reducer = createReducer(
  initialState,
  on(SessionsTableActions.toggleNode, (state, { nodeId }) => {
    const expandedNodes = state.expandedNodes.includes(nodeId)
      ? state.expandedNodes.filter(id => id !== nodeId)
      : state.expandedNodes.concat(nodeId);

    return {
      ...state,
      expandedNodes,
    };
  }),
  on(SessionsTableActions.clearExpandedNodes, state => ({
    ...state,
    expandedNodes: [],
  })),
);
