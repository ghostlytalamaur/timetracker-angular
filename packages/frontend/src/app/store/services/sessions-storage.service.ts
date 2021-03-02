import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireFunctions } from '@angular/fire/functions';
import { AuthService } from '@app/core/auth';
import { Range } from '@app/shared/utils';
import { FireCollections, UpdateSessionTagsParams } from '@app/storage/models';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionEntity, Update } from '../models';

import { FireEntityStorage, FireStoreQuery, QueryFunction } from './fire-entity-storage';

export interface SessionStorageEntity {
  id: string;
  start: firebase.firestore.Timestamp;
  duration: number | null;
  tags?: string[];
}

function toSessionStorageEntity(session: SessionEntity): SessionStorageEntity {
  return {
    id: session.id,
    start: firebase.firestore.Timestamp.fromDate(new Date(session.start)),
    duration: session.duration,
    tags: session.tags,
  };
}

function fromSessionStorageEntity(session: SessionStorageEntity): SessionEntity {
  return {
    id: session.id,
    start: session.start.toDate().valueOf(),
    duration: session.duration,
    tags: session.tags ?? [],
  };
}

@Injectable({
  providedIn: 'root',
})
export class SessionsStorageService extends FireEntityStorage<SessionStorageEntity> {

  private updateSessionTagsFunc: (options: UpdateSessionTagsParams) => Observable<void>;

  constructor(
    afs: AngularFirestore,
    auth: AuthService,
    private readonly functions: AngularFireFunctions,
  ) {
    super(afs, auth, FireCollections.Sessions);
    this.updateSessionTagsFunc = this.functions.httpsCallable('updateSessionTags');
  }

  addedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.addedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  modifiedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.modifiedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  removedSessions(): Observable<string[]> {
    return this.deletedEntities();
  }

  addSession(session: SessionEntity): Observable<void> {
    return this.addEntities(toSessionStorageEntity(session));
  }

  addSessions(sessions: SessionEntity[]): Observable<void> {
    return this.addEntities(...sessions.map(session => toSessionStorageEntity(session)));
  }

  removeSessions(ids: string[]): Observable<void> {
    return this.deleteEntities(...ids);
  }

  updateSessionTags(options: { sessionId: string; tagId: string; append: boolean }): Observable<void> {
    return this.updateSessionTagsFunc(options);
  }

  updateSessions(changes: Update<SessionEntity>[]): Observable<void> {
    const stChanges: Update<SessionStorageEntity>[] = changes.map(change => {
      if (typeof change.start === 'number') {
        return {
          ...change,
          start: firebase.firestore.Timestamp.fromDate(new Date(change.start)),
        };
      } else {
        return { ...change } as Update<SessionStorageEntity>;
      }
    });

    return this.updateEntities(...stChanges);
  }

  private makeQueryFn(range: Range<DateTime>): QueryFunction<FireStoreQuery<SessionStorageEntity>> {
    return query =>
      query
        .where('start', '>=', firebase.firestore.Timestamp.fromDate(range.start.toJSDate()))
        .where('start', '<=', firebase.firestore.Timestamp.fromDate(range.end.toJSDate()));
  }

}
