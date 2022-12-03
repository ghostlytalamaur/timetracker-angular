import { inject, Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  addDoc,
  collection,
  collectionChanges,
  doc,
  Firestore,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  Timestamp,
  updateDoc, where,
} from '@angular/fire/firestore';
import { Session, sessionActions } from './sessions.store';
import { EMPTY, map, mergeMap, of, switchMap } from 'rxjs';
import { authFeature } from '../auth/auth.store';

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
            ...action.session,
            uid: user.id,
          });
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onStopSession = createEffect(
    () => {
      return this.actions.pipe(
        ofType(sessionActions.stopSession),
        mergeMap((action) => {
          return updateDoc(doc(this.sessionsCol, action.id), {
            durationMs: action.durationMs,
          });
        }),
      );
    },
    { dispatch: false },
  );

  public readonly onLoadSessions = createEffect(() => {
    return this.store.select(authFeature.selectUser).pipe(
     switchMap(user => {
       if (!user) {
         return of(sessionActions.clearSessions());
       }

       return collectionChanges(query(this.sessionsCol, where('uid', '==', user.id))).pipe(
         map((changes) => {
           const sessions = changes.map((change) => change.doc.data());

           return sessionActions.sessionsChanged({ sessions });
         }),
       );
     })
    )
  });
}
