import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { createSelector, Store } from '@ngrx/store';
import {
  addDoc,
  collection,
  collectionSnapshots,
  deleteDoc,
  doc,
  Firestore,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { sessionActions } from './sessions.store';
import { EMPTY, map, mergeMap, of, switchMap } from 'rxjs';
import { authFeature } from '../auth/auth.store';
import { Session } from './session';
import { sessionsViewFeature } from './sessions-view.store';

interface SessionData {
  readonly start: Timestamp;
  readonly durationMs: number;
  readonly description: string;
  readonly uid: string;
}

interface UserSession extends Session {
  readonly uid: string;
}

const firestoreConverter: FirestoreDataConverter<UserSession> = {
  toFirestore(modelObject: UserSession): SessionData {
    return {
      start: Timestamp.fromDate(modelObject.start),
      durationMs: modelObject.durationMs,
      description: modelObject.description,
      uid: modelObject.uid,
    };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<SessionData>): UserSession {
    const data = snapshot.data();

    return {
      id: snapshot.id,
      start: data.start.toDate(),
      durationMs: data.durationMs,
      description: data.description,
      uid: data.uid,
    };
  },
};

@Injectable()
export class SessionsEffects {
  private readonly store = inject(Store);
  private readonly actions = inject(Actions);
  private readonly firestore = inject(Firestore);
  private readonly sessionsCol = collection(this.firestore, 'sessions').withConverter(
    firestoreConverter,
  );

  public readonly onStartSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.startSession),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        mergeMap(([action, user]) => {
          if (!user) {
            return EMPTY;
          }

          return addDoc(this.sessionsCol, {
            id: '',
            start: action.start,
            description: '',
            durationMs: -1,
            uid: user.id,
          });
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onChangeSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.changeSession),
        mergeMap(({ changes: { id, changes } }) => {
          return updateDoc(doc(this.sessionsCol, id as string), changes);
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onDeleteSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.deleteSession),
        mergeMap(({ id }) => {
          return deleteDoc(doc(this.sessionsCol, id));
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onLoadSessions = createEffect(() => {
    const selectQueryData = createSelector(
      authFeature.selectUser,
      sessionsViewFeature.selectRange,
      (user, range) => ({ user, range }),
    );

    const request$ = this.actions.pipe(ofType(sessionActions.loadSessions));

    const load$ = this.store.select(selectQueryData).pipe(
      switchMap(({ user, range }) => {
        if (!user) {
          return of(sessionActions.clearSessions());
        }

        return collectionSnapshots(
          query(
            this.sessionsCol,
            where('uid', '==', user.id),
            where('start', '>=', range.from),
            where('start', '<=', range.to),
          ),
        ).pipe(
          map((changes) => {
            const sessions = changes.map((doc) => {
              return doc.data();
            });

            return sessionActions.sessionsLoaded({ sessions });
          }),
        );
      }),
    );

    return request$.pipe(switchMap(() => load$));
  });
}
