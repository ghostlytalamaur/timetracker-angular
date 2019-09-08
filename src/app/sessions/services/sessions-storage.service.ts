import { SessionEntity } from '../model/session-entity';
import { inject, Inject, Injectable, InjectionToken } from '@angular/core';
import { EntityStorage, Update } from './entity-storage';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FireEntityStorage } from './fire-entity-storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/auth/auth.service';
import { LocalEntityStorage } from './local-entity-storage';

const sessionsCollection = 'sessions';
const SESSIONS_STORAGE = new InjectionToken<EntityStorage<SessionEntity>>('Sessions storage implementation', {
  providedIn: 'root',

  // Use local storage api in development environment to reduce fireStore api calls and decrease quota usage
  factory: () => environment.production ?
    new FireEntityStorage(inject(AngularFirestore), inject(AuthService), sessionsCollection) :
    new LocalEntityStorage(sessionsCollection)
});

@Injectable({
  providedIn: 'root'
})
export class SessionsStorageService {
  constructor(
    @Inject(SESSIONS_STORAGE) private readonly storage: EntityStorage<SessionEntity>
  ) {
  }

  addedSessions(): Observable<SessionEntity[]> {
    return this.storage.addedEntities();
  }

  modifiedSessions(): Observable<SessionEntity[]> {
    return this.storage.modifiedEntities();
  }

  removedSessions(): Observable<string[]> {
    return this.storage.removedEntities();
  }

  addSession(session: SessionEntity): Promise<void> {
    return this.storage.addEntities(session);
  }

  addSessions(sessions: SessionEntity[]): Promise<void> {
    return this.storage.addEntities(...sessions);
  }

  removeSession(id: string): Promise<void> {
    return this.storage.deleteEntities(id);
  }

  updateSessions(changes: Update<SessionEntity>[]): Promise<void> {
    return this.storage.updateEntities(...changes);
  }

}
