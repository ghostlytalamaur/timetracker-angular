import { Inject, inject, Injectable, InjectionToken } from '@angular/core';
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
// import { environment } from '../../../environments/environment';
import { FireEntityStorage } from './fire-entity-storage';

export interface SessionStorageEntity {
  id: string;
  start: firebase.firestore.Timestamp;
  duration: number | null;
}


export function createFireStorage(): EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>> {
  return new FireEntityStorage(inject(AngularFirestore), inject(AuthService), 'sessions');
}

//
// function createDexieStorage(): EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>> {
//   const db = inject(DbService);
//   return new DexieEntityStorage(db, db.sessions);
// }

export const SESSIONS_STORAGE = new InjectionToken<EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>>(
  'Sessions storage implementation', {
    providedIn: 'root',
    // Use local indexedDb api in development environment to reduce fireStore api calls and decrease quota usage
    factory: () => createFireStorage(),
    // factory: () => !environment.production ? createFireStorage() : createDexieStorage()
  });


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

@Injectable({
  providedIn: 'root',
})
export class SessionsStorageService {
  constructor(
    @Inject(SESSIONS_STORAGE) private readonly storage: EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>,
  ) {
  }

  addedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.addedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  modifiedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.modifiedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity))),
      );
  }

  removedSessions(): Observable<string[]> {
    return this.storage.deletedEntities();
  }

  addSession(session: SessionEntity): Promise<void> {
    return this.storage.addEntities(toSessionStorageEntity(session));
  }

  addSessions(sessions: SessionEntity[]): Promise<void> {
    return this.storage.addEntities(...sessions.map(session => toSessionStorageEntity(session)));
  }

  removeSession(id: string): Promise<void> {
    return this.storage.deleteEntities(id);
  }

  updateSessions(changes: Update<SessionEntity>[]): Promise<void> {
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
