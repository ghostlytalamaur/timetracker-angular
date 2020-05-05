import { createAction, props } from '@ngrx/store';

export const toggleNode = createAction(
  '[Sessions Table] Toggle Node',
  props<{
    nodeId: string;
  }>(),
);

export const clearExpandedNodes = createAction(
  '[Sessions Table] Clear Expanded Nodes',
)
