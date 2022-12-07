import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionSnapshots,
  Firestore,
  FirestoreDataConverter,
} from '@angular/fire/firestore';
import { DocumentData, query, QueryDocumentSnapshot, where } from '@firebase/firestore';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { EMPTY, map, mergeMap, of, switchMap } from 'rxjs';
import { authFeature } from '../auth/auth.store';
import { Tag } from '../models/tag';
import { tagsActions } from './tags.store';

@Injectable()
export class TagsEffects {
  private readonly store = inject(Store);
  private readonly actions = inject(Actions);
  private readonly firestore = inject(Firestore);
  private readonly collection = collection(this.firestore, 'tags').withConverter(
    new (class implements FirestoreDataConverter<Tag> {
      fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Tag & { uid: string } {
        const data = snapshot.data();

        return {
          id: snapshot.id,
          caption: data['caption'],
          color: data['color'],
          uid: data['uid'],
        };
      }

      toFirestore(modelObject: Tag & { uid: string }): DocumentData {
        return {
          caption: modelObject.caption,
          color: modelObject.color,
          uid: modelObject.uid,
        };
      }
    })(),
  );

  public readonly onLoad = createEffect(() => {
    return this.actions.pipe(
      ofType(tagsActions.loadTags),
      switchMap(() => this.store.select(authFeature.selectUser)),
      switchMap((user) => {
        if (!user) {
          return of(tagsActions.clearTags());
        }

        return collectionSnapshots(query(this.collection, where('uid', '==', user.id))).pipe(
          map((snapshots) => {
            const tags = snapshots.map((snapshot) => snapshot.data());

            return tagsActions.loadTagsSuccess({ tags });
          }),
        );
      }),
    );
  });

  public readonly onCreateTag = createEffect(
    () => {
      return this.actions.pipe(
        ofType(tagsActions.createTag),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        mergeMap(([{ params }, user]) => {
          if (!user) {
            return EMPTY;
          }

          return addDoc(this.collection, {
            id: '',
            caption: params.caption,
            color: params.color,
            uid: user.id,
          });
        }),
      );
    },
    { dispatch: false },
  );
}
