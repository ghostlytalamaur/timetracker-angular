import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '@app/core/auth';
import { FireCollections } from '@app/storage/models';
import { Observable } from 'rxjs';

import { SessionTag } from '../models';

import { FireEntityStorage } from './fire-entity-storage';

@Injectable({
  providedIn: 'root',
})
export class SessionsTagsStorageService extends FireEntityStorage<SessionTag> {

  constructor(
    afs: AngularFirestore,
    auth: AuthService,
  ) {
    super(afs, auth, FireCollections.Tags);
  }

  addedTags(): Observable<SessionTag[]> {
    return this.addedEntities();
  }

  modifiedTags(): Observable<SessionTag[]> {
    return this.modifiedEntities();
  }

  deletedTags(): Observable<string[]> {
    return this.deletedEntities();
  }

  deleteTags(ids: string[]): Observable<void> {
    return this.deleteEntities(...ids);
  }

  addTags(tags: SessionTag[]): Observable<void> {
    return this.addEntities(...tags);
  }

}
