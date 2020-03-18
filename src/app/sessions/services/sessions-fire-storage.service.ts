import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { Range } from '../../shared/utils';
import { SessionEntity } from '../models';

import { EntityQuery, EntityStorage, QueryFunction, Update } from './entity-storage';
import { FireEntityStorage } from './fire-entity-storage';
import { SessionsStorage } from './sessions-storage.service';

export interface SessionStorageEntity {
  id: string;
  start: firebase.firestore.Timestamp;
  duration: number | null;
}

function toSessionStorageEntity(session: SessionEntity): SessionStorageEntity {
  return {
    id: session.id,
    start: firebase.firestore.Timestamp.fromDate(new Date(session.start)),
    duration: session.duration,
  };
}

function fromSessionStorageEntity(session: SessionStorageEntity): SessionEntity {
  return {
    id: session.id,
    start: session.start.toDate().valueOf(),
    duration: session.duration,
  };
}

@Injectable()
export class SessionsFireStorageService implements SessionsStorage {

  private storage: EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>;

  public constructor(afs: AngularFirestore, auth: AuthService) {
    this.storage = new FireEntityStorage(afs, auth, 'sessions');
  }

  public addedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.addedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  public modifiedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.modifiedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  public removedSessions(): Observable<string[]> {
    return this.storage.deletedEntities();
  }

  public addSession(session: SessionEntity): Promise<void> {
    return this.storage.addEntities(toSessionStorageEntity(session));
  }

  public addSessions(sessions: SessionEntity[]): Promise<void> {
    return this.storage.addEntities(...sessions.map(session => toSessionStorageEntity(session)));
  }

  public removeSessions(ids: string[]): Promise<void> {
    return this.storage.deleteEntities(...ids);
  }

  public updateSessions(changes: Update<SessionEntity>[]): Promise<void> {
    const stChanges: Update<SessionStorageEntity>[] = changes.map(change => {
      const stChange: Update<SessionStorageEntity> = {
        id: change.id,
      };
      if (change.start) {
        stChange.start = firebase.firestore.Timestamp.fromDate(new Date(change.start));
      }
      if (change.duration) {
        stChange.duration = change.duration;
      }
      return stChange;
    });
    return this.storage.updateEntities(...stChanges);
  }

  private makeQueryFn(range: Range<DateTime>): QueryFunction<EntityQuery<SessionStorageEntity>> {
    return query =>
      query.where('start', '>=', firebase.firestore.Timestamp.fromDate(range.start.toJSDate()))
        .where('start', '<=', firebase.firestore.Timestamp.fromDate(range.end.toJSDate()));
  }

}
