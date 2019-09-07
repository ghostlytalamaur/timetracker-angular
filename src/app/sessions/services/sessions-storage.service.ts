import { FireEntityService, Update } from './fire-entity.service';
import { SessionEntity } from '../model/session-entity';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/auth/auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionsStorageService extends FireEntityService<SessionEntity, SessionEntity> {

  constructor(
    afs: AngularFirestore,
    authService: AuthService
  ) {
    super(afs, authService, 'sessions');
  }

  addSession(session: SessionEntity): Promise<void> {
    return this.addEntity(session);
  }

  removeSession(id: string): Promise<void> {
    return this.deleteEntity(id);
  }

  updateSessions(changes: Update<SessionEntity>[]): Promise<void> {
    return this.updateEntities(changes);
  }

  protected createEntity(userId: string, data: SessionEntity): Promise<SessionEntity> | SessionEntity {
    return data;
  }

}
