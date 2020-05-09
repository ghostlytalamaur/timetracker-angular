import { InjectionToken, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/auth';
import { DbService } from '@app/core/db';
import { Range } from '@app/shared/utils';
import 'firebase/firestore';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { SessionEntity, Update } from '../models';

import { SessionsDexieStorageService } from './sessions-dexie-storage.service';
import { SessionsFireStorageService } from './sessions-fire-storage.service';


export interface SessionsStorage {
  addedSessions(range: Range<DateTime>): Observable<SessionEntity[]>;
  modifiedSessions(range: Range<DateTime>): Observable<SessionEntity[]>;
  removedSessions(): Observable<string[]>;
  addSession(session: SessionEntity): Promise<void>;
  addSessions(sessions: SessionEntity[]): Promise<void>;
  removeSessions(ids: string[]): Promise<void>;
  updateSessions(changes: Update<SessionEntity>[]): Promise<void>;
}

export function createFireStorage(): SessionsStorage {
  return new SessionsFireStorageService(inject(AngularFirestore), inject(AuthService));
}

export function createDexieStorage(): SessionsStorage {
  return new SessionsDexieStorageService(inject(DbService));
}

export const SESSIONS_STORAGE = new InjectionToken<SessionsStorage>(
  'Sessions storage implementation', {
    providedIn: 'root',
    // Use local indexedDb api in development environment to reduce fireStore api calls and decrease quota usage
    factory: () => environment.production ? createFireStorage() : createDexieStorage(),
  });
