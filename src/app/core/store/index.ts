import { ActionReducer, ActionReducerMap, INIT, MetaReducer, UPDATE } from '@ngrx/store';
import { LocalStorageService } from '../local-storage.service';

export interface State {
}

export const reducers: ActionReducerMap<State> = {};


function initStateFromLocalStorage(reducer: ActionReducer<State>): ActionReducer<State> {
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

const commonMetaReducers: MetaReducer<State>[] = [
  initStateFromLocalStorage
];

export const metaReducers: MetaReducer<State>[] = commonMetaReducers;

