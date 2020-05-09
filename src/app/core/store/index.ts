import { LocalStorageService } from '@app/core/services';
import { ActionReducer, ActionReducerMap, INIT, MetaReducer, UPDATE } from '@ngrx/store';

export type State = { }

export const reducers: ActionReducerMap<State> = { };


export function initStateFromLocalStorage(reducer: ActionReducer<State>): ActionReducer<State> {
  return (state, action) => {
    const newState = reducer(state, action);
    switch (action.type) {
      case INIT:
        return LocalStorageService.loadState('APP_STATE', newState);
      case UPDATE:
        const features = (action as any).features;
        if (Array.isArray(features)) {
          return features.reduce((loaded, feature) => LocalStorageService.loadState(feature, loaded), newState);
        }
    }

    return newState;
  };
}

export const metaReducers: MetaReducer<State>[] = [
  initStateFromLocalStorage,
];


