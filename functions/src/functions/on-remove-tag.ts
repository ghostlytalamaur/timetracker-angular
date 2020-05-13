import * as functions from 'firebase-functions';

import { FireCollections, FireSessionEntity, FireTagEntity, getCollectionPath } from '../interfaces';

import { fireApp } from './app';

export const onRemoveTag = functions.firestore
  .document(`users/{userId}/${FireCollections.Tags}/tagId`)
  .onDelete(async (snapshot, context) => {
    const userId = context.params.userId;
    const tagId = context.params.tagId;

    const tag = snapshot.data() as FireTagEntity;
    if (!tag) {
      return;
    }

    const sessionsDocs = await fireApp
      .firestore()
      .collection(getCollectionPath(userId, FireCollections.Sessions))
      .where('id', 'in', tag.sessions)
      .get();

    const promises: Promise<any>[] = [];
    sessionsDocs.forEach((sessionSnap) => {
      if (!sessionSnap.exists) {
        return;
      }

      const session = sessionSnap.data() as FireSessionEntity;
      if (!session) {
        return;
      }

      promises.push(
        sessionSnap.ref.update({
          tags: (session.tags ?? []).filter((id) => id !== tagId),
        }),
      );
    });

    await Promise.all(promises);
  });
