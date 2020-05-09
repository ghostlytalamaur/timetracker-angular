import { Injectable } from '@angular/core';
import { DbService } from '@app/core/db';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Range } from '../../shared/utils';
import { SessionEntity, Update } from '../models';

import { DexieEntityStorage } from './dexie-entity-storage';
import { EntityQuery, EntityStorage, QueryFunction } from './entity-storage';
import { SessionsStorage } from './sessions-storage.service';


export interface SessionStorageEntity {
  id: string;
  start: Date;
  duration: number | null;
}

function toSessionStorageEntity(session: SessionEntity): SessionStorageEntity {
  return {
    id: session.id,
    start: new Date(session.start),
    duration: session.duration,
  };
}

function fromSessionStorageEntity(session: SessionStorageEntity): SessionEntity {
  return {
    id: session.id,
    start: session.start.valueOf(),
    duration: session.duration,
  };
}

@Injectable()
export class SessionsDexieStorageService implements SessionsStorage {

  private storage: EntityStorage<SessionStorageEntity, EntityQuery<SessionStorageEntity>>;

  public constructor(db: DbService) {
    this.storage = new DexieEntityStorage(db, db.sessions)
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
