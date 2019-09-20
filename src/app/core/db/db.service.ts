import Dexie from 'dexie';
import { Injectable } from '@angular/core';
import { SessionStorageEntity } from './session-storage-entity';

@Injectable({
  providedIn: 'root'
})
export class DbService extends Dexie {

  readonly sessions: Dexie.Table<SessionStorageEntity, string>;

  constructor() {
    super('time_tracker_db');
    this.version(1)
      .stores({
        sessions: '&id, start'
      });

    this.sessions = this.table('sessions');
  }
}
