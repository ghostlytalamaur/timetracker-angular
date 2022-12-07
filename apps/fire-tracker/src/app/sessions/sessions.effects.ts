import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { createSelector, Store } from '@ngrx/store';
import {
  collection,
  collectionSnapshots,
  deleteDoc,
  doc,
  docData,
  Firestore,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { selectActiveSession, sessionActions } from './sessions.store';
import { catchError, EMPTY, map, merge, mergeMap, of, switchMap } from 'rxjs';
import { authFeature } from '../auth/auth.store';
import { Session } from './session';
import { sessionsViewFeature } from './sessions-view.store';

interface SessionData {
  readonly start: Timestamp;
  readonly durationMs: number;
  readonly description: string;
  readonly uid: string;
  readonly tags?: string[];
}

interface ActiveSessionData {
  readonly start: Timestamp;
  readonly description: string;
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
      tags: modelObject.tags,
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
      tags: data.tags ?? [],
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
  private readonly activeSessionsCol = collection(this.firestore, 'activeSessions').withConverter({
    toFirestore(modelObject: { start: Date; description: string }): ActiveSessionData {
      return {
        start: Timestamp.fromDate(modelObject.start),
        description: modelObject.description,
      };
    },
    fromFirestore(snapshot) {
      const data = snapshot.data();

      return {
        start: data['start'].toDate(),
        description: data['description'],
      };
    },
  });

  public readonly onStartSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.startSession),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        mergeMap(([action, user]) => {
          if (!user) {
            return EMPTY;
          }

          return runTransaction(this.firestore, async (transaction) => {
            const d = doc(this.activeSessionsCol, user.id);
            const snapshot = await transaction.get(d);
            if (snapshot.exists()) {
              console.error('There is active session');

              return;
            }

            return transaction.set(d, { start: action.start, description: action.description });
          }).catch((err) => console.error(err));
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onStopSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.stopSession),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        mergeMap(([{ durationMs }, user]) => {
          if (!user) {
            return EMPTY;
          }

          return runTransaction(this.firestore, async (transaction) => {
            const d = doc(this.activeSessionsCol, user.id);
            const snapshot = await transaction.get(d);
            if (!snapshot.exists()) {
              console.error('There is no active session');

              return;
            }
            const data = snapshot.data();
            const sessionData = {
              start: data.start,
              description: data.description,
              durationMs,
              uid: user.id,
            };

            return transaction.delete(d).set(doc(this.sessionsCol), sessionData);
          }).catch((err) => console.error(err));
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onChangeActiveSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.changeActiveSession),
        concatLatestFrom(() => [
          this.store.select(selectActiveSession),
          this.store.select(authFeature.selectUser),
        ]),
        mergeMap(([action, activeSession, user]) => {
          if (!user || !activeSession) {
            return EMPTY;
          }

          const docRef = doc(this.activeSessionsCol, user.id);

          return updateDoc(docRef, { description: action.description }).catch(console.error);
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onDiscardActiveSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.discardActiveSession),
        concatLatestFrom(() => this.store.select(authFeature.selectUser)),
        mergeMap(([, user]) => {
          if (!user) {
            return EMPTY;
          }

          return deleteDoc(doc(this.activeSessionsCol, user.id)).catch(console.error);
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
          return updateDoc(doc(this.sessionsCol, id as string), changes).catch((err) =>
            console.error(err),
          );
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
          return deleteDoc(doc(this.sessionsCol, id)).catch((err) => console.error(err));
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

        const sessionsInRange$ = collectionSnapshots(
          query(
            this.sessionsCol,
            where('uid', '==', user.id),
            where('start', '>=', range.from),
            where('start', '<=', range.to),
          ),
        );

        const activeDoc$ = docData(doc(this.activeSessionsCol, user.id)).pipe(
          map((data) => {
            if (!data) {
              return sessionActions.activeSessionLoaded({ session: undefined });
            }

            return sessionActions.activeSessionLoaded({
              session: {
                id: 'ACTIVE',
                start: data.start,
                description: data.description,
                durationMs: -1,
                tags: [],
              },
            });
          }),
          catchError((err) => {
            console.error(err);

            return EMPTY;
          }),
        );

        const loadedSessions$ = sessionsInRange$.pipe(
          map((sessionsInRange) => {
            const sessions = sessionsInRange.map((doc) => {
              return doc.data();
            });

            return sessionActions.sessionsLoaded({ sessions });
          }),
          catchError((err) => {
            console.error(err);

            return EMPTY;
          }),
        );

        return merge(activeDoc$, loadedSessions$);
      }),
    );

    return request$.pipe(switchMap(() => load$));
  });
}
