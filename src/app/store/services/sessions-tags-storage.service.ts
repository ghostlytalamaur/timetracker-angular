import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

import { AuthService } from '../../core/auth/auth.service';
import { EntityQuery, EntityStorage } from '../../sessions/services/entity-storage';
import { FireEntityStorage } from '../../sessions/services/fire-entity-storage';
import { SessionTag } from '../models';

@Injectable({
  providedIn: 'root',
})
export class SessionsTagsStorageService {

  private storage: EntityStorage<SessionTag, EntityQuery<SessionTag>>;

  public constructor(afs: AngularFirestore, auth: AuthService) {
    this.storage = new FireEntityStorage(afs, auth, 'sessions-tags');
  }

  public addedTags(): Observable<SessionTag[]> {
    return this.storage.addedEntities();
  }

  public modifiedTags(): Observable<SessionTag[]> {
    return this.storage.modifiedEntities();
  }

  public deletedTags(): Observable<string[]> {
    return this.storage.deletedEntities();
  }

  public deleteTags(ids: string[]): Observable<void> {
    return from(this.storage.deleteEntities(...ids));
  }

  public addTags(tags: SessionTag[]): Observable<void> {
    return from(this.storage.addEntities(...tags));
  }

}
