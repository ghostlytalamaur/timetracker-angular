import { Dictionary } from '@ngrx/entity';
import { compose, createSelector } from '@ngrx/store';

import { Session, SessionTag, isRunning } from '../models';
import { fromSessions } from '../reducers';

import { selectStoreFeature } from './feature.selectors';
import * as TagsSelectors from './tags.selectors';

const selectSessionsState = createSelector(
  selectStoreFeature,
  state => state.sessions,
);

const {
  selectEntities,
  selectAll,
} = fromSessions.adapter.getSelectors(selectSessionsState);

function getTags(tagsDict: Dictionary<SessionTag>, ids: string[]): SessionTag[] {
  return ids
    .reduce((acc, tagId) => {
      const tag = tagsDict[tagId];
      if (tag) {
        acc.push(tag);
      }

      return acc;
    }, new Array<SessionTag>());
}

export const selectSessions = createSelector(
  selectAll,
  TagsSelectors.selectTagsEntities,
  (entities, tagsDict) => entities
      .map(e => Session.fromEntity(e, getTags(tagsDict, e.tags)))
      .sort((a, b) => a.start.valueOf() - b.start.valueOf()),
);

export const selectRunningSessions = createSelector(
  selectSessions,
  sessions => sessions.filter(isRunning),
);

export const selectHasRunningSessions = createSelector(
  selectRunningSessions,
  sessions => sessions.length > 0,
);

export const selectSessionEntity = (id: string) => createSelector(
  selectEntities,
  entities => entities[id] ?? null,
);

export const selectSession = (id: string) => createSelector(
  selectEntities,
  TagsSelectors.selectTagsEntities,
  (entities, tagsDict) => {
    const e = entities[id];
    return e && Session.fromEntity(e, getTags(tagsDict, e.tags));
  });

export const selectStatus = compose(
  state => state.status,
  selectSessionsState,
);

export const selectIsLoaded = createSelector(
  selectSessionsState,
  state => state.loaded,
);
