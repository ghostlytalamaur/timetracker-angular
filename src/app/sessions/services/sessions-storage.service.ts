import { FireEntityService } from './fire-entity.service';
import { SessionEntity } from '../model/session-entity';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../../core/auth/auth.service';
import { Injectable } from '@angular/core';
import { UpdateStr } from '@ngrx/entity/src/models';

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
    return this.addEntity(session.id, session);
  }

  removeSession(id: string): Promise<void> {
    return this.deleteEntity(id);
  }

  updateSession(changes: UpdateStr<SessionEntity>): Promise<void> {
    return this.updateEntity(changes.id, changes.changes);
  }

  updateSessions(changes: UpdateStr<SessionEntity>[]): Promise<void> {
    const data = changes.map(c => ({ id: c.id, entityData: c.changes }));
    return this.updateEntities(data);
  }

  protected createEntity(userId: string, id: string, data: SessionEntity): Promise<SessionEntity> | SessionEntity {
    return data;
  }

}
