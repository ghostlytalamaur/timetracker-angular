import { SessionEntity } from '../model/session-entity';
import { inject, Inject, Injectable, InjectionToken } from '@angular/core';
import { EntityQuery, EntityStorage, QueryFunction, Update } from './entity-storage';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FireEntityStorage } from './fire-entity-storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/auth/auth.service';
import { Range } from '../../shared/utils';
import { DateTime } from 'luxon';
import { map } from 'rxjs/operators';
import { DexieEntityStorage } from './dexie-entity-storage';
import { SessionStorageEntity } from '../../core/db/session-storage-entity';
import { DbService } from '../../core/db/db.service';

function createFireStorage(): EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>> {
  return new FireEntityStorage(inject(AngularFirestore), inject(AuthService), 'sessions');
}

function createDexieStorage(): EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>> {
  const db = inject(DbService);
  return new DexieEntityStorage(db, db.sessions);
}

const SESSIONS_STORAGE = new InjectionToken<EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>>('Sessions storage implementation', {
  providedIn: 'root',
  // Use local indexedDb api in development environment to reduce fireStore api calls and decrease quota usage
  factory: () => environment.production ? createFireStorage() : createDexieStorage()
});


function toSessionStorageEntity(session: SessionEntity): SessionStorageEntity {
  return {
    id: session.id,
    start: new Date(session.start),
    duration: session.duration
  };
}

function fromSessionStorageEntity(session: SessionStorageEntity): SessionEntity {
  return {
    id: session.id,
    start: session.start.valueOf(),
    duration: session.duration
  };
}

@Injectable({
  providedIn: 'root'
})
export class SessionsStorageService {
  constructor(
    @Inject(SESSIONS_STORAGE) private readonly storage: EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>
  ) {
  }

  addedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.addedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity)))
      );
  }

  modifiedSessions(range: Range<DateTime>): Observable<SessionEntity[]> {
    return this.storage.modifiedEntities(this.makeQueryFn(range))
      .pipe(
        map(entities => entities.map(entity => fromSessionStorageEntity(entity)))
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
        id: change.id
      };
      if (change.start) {
        stChange.start = new Date(change.start);
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
      query.where('start', '>=', range.start.toJSDate())
        .where('start', '<=', range.end.toJSDate());
  }
}
