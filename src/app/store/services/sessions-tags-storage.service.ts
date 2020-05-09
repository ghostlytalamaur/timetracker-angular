import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/auth';
import { Observable, from } from 'rxjs';

import { SessionTag } from '../models';

import { EntityQuery, EntityStorage } from './entity-storage';
import { FireEntityStorage } from './fire-entity-storage';

@Injectable({
  providedIn: 'root',
})
export class SessionsTagsStorageService {

  private storage: EntityStorage<SessionTag, EntityQuery<SessionTag>>;

  public constructor(
    afs: AngularFirestore,
    auth: AuthService,
  ) {
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
