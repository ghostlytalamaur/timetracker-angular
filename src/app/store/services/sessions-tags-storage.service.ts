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

  public constructor(
    afs: AngularFirestore,
    auth: AuthService,
  ) {
    super(afs, auth, FireCollections.Tags);
  }

  public addedTags(): Observable<SessionTag[]> {
    return this.addedEntities();
  }

  public modifiedTags(): Observable<SessionTag[]> {
    return this.modifiedEntities();
  }

  public deletedTags(): Observable<string[]> {
    return this.deletedEntities();
  }

  public deleteTags(ids: string[]): Observable<void> {
    return this.deleteEntities(...ids);
  }

  public addTags(tags: SessionTag[]): Observable<void> {
    return this.addEntities(...tags);
  }

}
