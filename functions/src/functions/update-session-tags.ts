import * as functions from 'firebase-functions';

import { FireCollections, FireSessionEntity, FireTagEntity, getCollectionPath, isUpdateSessionTagsParams } from '../interfaces';

import { fireApp } from './app';

export const updateSessionTags = functions.https.onCall(async (data, context) => {
  if (isUpdateSessionTagsParams(data) && context && context.auth) {
    const sessionDoc = fireApp
      .firestore()
      .collection(getCollectionPath(context.auth.uid, FireCollections.Sessions))
      .doc(data.sessionId);
    const tagDoc = fireApp
      .firestore()
      .collection(getCollectionPath(context.auth.uid, FireCollections.Tags))
      .doc(data.tagId);

    const docs = await Promise.all([sessionDoc.get(), tagDoc.get()]);
    if (!docs[0].exists || !docs[1].exists) {
      throw new functions.https.HttpsError('not-found', 'Docs with this id does not exists');
    }

    const session = docs[0].data() as FireSessionEntity;
    const tag = docs[1].data() as FireTagEntity;
    if (!session || !tag) {
      throw new functions.https.HttpsError('not-found', 'Data with this id does not exists');
    }

    const promises: Promise<unknown>[] = [];
    let sessionTags: string[] | null = null;
    let tagSessions: string[] | null = null;
    if (data.append) {
      if (!session.tags || !session.tags.includes(tag.id)) {
        sessionTags = (session.tags ?? []).concat(tag.id);
      }

      if (!tag.sessions.includes(session.id)) {
        tagSessions = tag.sessions.concat(session.id);
      }
    } else {
      if (tag.sessions.includes(session.id)) {
        tagSessions = tag.sessions.filter((id) => id !== session.id);
      }

      if (session.tags && session.tags.includes(tag.id)) {
        sessionTags = session.tags.filter((id) => id !== tag.id);
      }
    }

    if (sessionTags) {
      promises.push(sessionDoc.update({ tags: sessionTags }));
    }
    if (tagSessions) {
      promises.push(tagDoc.update({ sessions: tagSessions }));
    }

    return Promise.all(promises).then();
  }

  throw new functions.https.HttpsError('invalid-argument', 'Invalid parameters');
});
