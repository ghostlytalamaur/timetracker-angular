import { AngularFirestore, DocumentChangeAction, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { NEVER, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/model/user';
import { EntityStorage, EntityType, Update } from './entity-storage';


export class FireEntityStorage<Entity extends EntityType> implements EntityStorage<Entity> {

  constructor(
    private readonly afs: AngularFirestore,
    protected readonly authService: AuthService,
    private readonly collection: string
  ) {
  }

  addedEntities(): Observable<Entity[]> {
    return this.changedEntities('added');
  }

  modifiedEntities(): Observable<Entity[]> {
    return this.changedEntities('modified');
  }

  removedEntities(): Observable<string[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.deletedEntitiesForUser(user) : NEVER)
      );
  }

  async deleteEntities(...ids: string[]): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      for (const id of ids) {
        const promise = this.afs
          .collection<Entity>(this.getCollectionPath(user.id))
          .doc(id)
          .delete();
        promises.push(promise);
      }
      return Promise.all(promises).then();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  async updateEntities(...changes: Update<Entity>[]): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.id);
      for (const change of changes) {
        const res = this.afs.collection<Entity>(collection)
          .doc(change.id)
          .update(change);
        promises.push(res);
      }
      return Promise.all(promises).then();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  async addEntities(...entities: Entity[]): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.id);
      for (const entity of entities) {
        if (!entity) {
          continue;
        }
        const res = this.afs.collection<Entity>(collection)
          .doc(entity.id)
          .set(entity);
        promises.push(res);
      }
      return Promise.all(promises).then();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  private changedEntities(type: 'added' | 'modified'): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.changedEntitiesForUser(user, type) : NEVER)
      );
  }

  private changedEntitiesForUser(user: User, type: 'added' | 'modified'): Observable<Entity[]> {
    const action$ = this.afs.collection<Entity>(this.getCollectionPath(user.id)).stateChanges([type]);
    return this.createEntitiesForUser(action$);
  }

  private createEntitiesForUser(action$: Observable<DocumentChangeAction<Entity>[]>): Observable<Entity[]> {
    return action$
      .pipe(
        switchMap(changes => Promise.all(changes.map(doc => this.createEntityFromDoc(doc.payload.doc)))),
        map(entities => entities.filter(entity => !!entity) as Entity[])
      );
  }

  private deletedEntitiesForUser(user: User): Observable<string[]> {
    return this.afs.collection<Entity>(this.getCollectionPath(user.id)).stateChanges(['removed'])
      .pipe(
        map(changes => changes.map(change => change.payload.doc.id))
      );
  }

  private createEntityFromDoc(doc: QueryDocumentSnapshot<Entity> | DocumentSnapshot<Entity>): Entity | undefined {

    if (doc.exists) {
      return doc.data();
    } else {
      return undefined;
    }
  }

  private getCollectionPath(userId: string): string {
    return `users/${userId}/${this.collection}`;
  }

}
