import { AngularFirestore, DocumentChangeAction, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { NEVER, Observable, of, zip } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { User } from '../../core/auth/model/user';

interface EntityType {
  id: string;
}

export type Update<T> = EntityType & Partial<T>;


export abstract class FireEntityService<Entity extends EntityType, EntityData extends EntityType> {

  protected constructor(
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

  loadEntities(): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.loadEntitiesForUser(user) : of([])),
        take(1)
      );
  }

  getEntities(ids: string[]): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.getEntitiesForUser(ids, user) : of([]))
      );
  }

  async deleteEntity(id: string): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      return this.afs
        .collection<EntityData>(this.getCollectionPath(user.id))
        .doc(id)
        .delete();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected async updateEntity(change: Update<EntityData>): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      return this.afs.collection<EntityData>(this.getCollectionPath(user.id))
        .doc(change.id)
        .update(change);
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected async updateEntities(changes: Update<EntityData>[]): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.id);
      for (const change of changes) {
        const res = this.afs.collection<EntityData>(collection)
          .doc(change.id)
          .update(change);
        promises.push(res);
      }
      return Promise.all(promises).then();
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected async addEntities(entities: EntityData[]): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.id);
      for (const entity of entities) {
        const res = this.afs.collection<EntityData>(collection)
          .doc(entity.id)
          .set(entity);
        promises.push(res);
      }
      return Promise.all(promises).then();
    }
  }

  protected async addEntity(entityData: EntityData): Promise<void> {
    const user = await this.authService.user;
    if (user) {
      return this.afs.collection<EntityData>(this.getCollectionPath(user.id))
        .doc(entityData.id)
        .set(entityData);
    } else {
      return Promise.reject(new Error('Not authenticated'));
    }
  }

  protected abstract createEntity(userId: string, data: EntityData): Entity | Promise<Entity>;

  protected getEntityPath(userId: string, entityId: string): string {
    return `${this.getCollectionPath(userId)}/${entityId}`;
  }

  private changedEntities(type: 'added' | 'modified'): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.changedEntitiesForUser(user, type) : NEVER)
      );
  }

  private loadEntitiesForUser(user: User): Observable<Entity[]> {
    const action$ = this.afs.collection<EntityData>(this.getCollectionPath(user.id)).snapshotChanges();
    return this.createEntitiesForUser(user, action$);
  }

  private changedEntitiesForUser(user: User, type: 'added' | 'modified'): Observable<Entity[]> {
    const action$ = this.afs.collection<EntityData>(this.getCollectionPath(user.id)).stateChanges([type]);
    return this.createEntitiesForUser(user, action$);
  }

  private createEntitiesForUser(user: User, action$: Observable<DocumentChangeAction<EntityData>[]>): Observable<Entity[]> {
    return action$
      .pipe(
        switchMap(changes => Promise.all(changes.map(doc => this.createEntityFromDoc(user, doc.payload.doc)))),
        map(entities => entities.filter(entity => !!entity) as Entity[])
      );
  }

  private deletedEntitiesForUser(user: User): Observable<string[]> {
    return this.afs.collection<EntityData>(this.getCollectionPath(user.id)).stateChanges(['removed'])
      .pipe(
        map(changes => changes.map(change => change.payload.doc.id))
      );
  }

  private createEntityFromDoc(user: User,
                              doc: QueryDocumentSnapshot<EntityData> | DocumentSnapshot<EntityData>):
    Promise<Entity | undefined> {

    if (doc.exists) {
      const data = doc.data();
      const entity = this.createEntity(user.id, data);
      if (entity instanceof Promise) {
        return entity;
      } else {
        return Promise.resolve(entity);
      }
    } else {
      return Promise.resolve(undefined);
    }
  }

  private getEntity(user: User, id: string): Observable<Entity | undefined> {
    return this.afs
      .doc<EntityData>(this.getEntityPath(user.id, id))
      .snapshotChanges()
      .pipe(
        switchMap(change => this.createEntityFromDoc(user, change.payload))
      );
  }

  private getEntitiesForUser(ids: string[], user: User): Observable<Entity[]> {
    const entities$ = ids.map(id => this.getEntity(user, id));
    return zip(...entities$)
      .pipe(
        map(entities => entities.filter(entity => !!entity) as Entity[])
      );
  }

  private getCollectionPath(userId: string): string {
    return `users/${userId}/${this.collection}`;
  }

}
