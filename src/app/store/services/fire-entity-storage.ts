import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  QueryFn,
} from '@angular/fire/firestore';
import { AuthService, User } from '@app/core/auth';
import { NEVER, Observable, merge, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { EntityType, Update } from '../models';

import { EntityQuery, EntityStorage, OrderByDirection, QueryFunction, WhereFilterOp } from './entity-storage';

class FireStoreQuery<E> implements EntityQuery<E> {
  public constructor(
    public ref: Query,
  ) {
  }

  public limit(limit: number): this {
    this.ref = this.ref.limit(limit);
    return this;
  }

  public orderBy<K extends keyof E & string>(field: K, direction?: OrderByDirection): this {
    this.ref = this.ref.orderBy(field, direction);
    return this;
  }

  public where<K extends keyof E & string>(field: K, operation: WhereFilterOp, value: E[K]): this {
    this.ref = this.ref.where(field, operation, value);
    return this;
  }

}

export class FireEntityStorage<Entity extends EntityType> implements EntityStorage<Entity, FireStoreQuery<Entity>> {

  public constructor(
    private readonly afs: AngularFirestore,
    protected readonly authService: AuthService,
    private readonly collection: string,
  ) {
  }

  public addedEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return merge(
      this.loadEntities(queryFn),
      this.changedEntities('added', queryFn),
    );
  }

  public modifiedEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.changedEntities('modified', queryFn);
  }

  public deletedEntities(): Observable<string[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.deletedEntitiesForUser(user) : NEVER),
      );
  }

  public async deleteEntities(...ids: string[]): Promise<void> {
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

  public async updateEntities(...changes: Update<Entity>[]): Promise<void> {
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

  public async addEntities(...entities: Entity[]): Promise<void> {
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

  private changedEntities(type: 'added' | 'modified', queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? this.changedEntitiesForUser(user, type, queryFn) : NEVER),
      );
  }

  private loadEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.authService.user$
      .pipe(
        switchMap(user => {
          if (user) {
            const collection = this.afs.collection<Entity>(this.getCollectionPath(user.id));
            return this.afs.collection<Entity>(collection.ref, this.wrapQuery(queryFn))
              .get()
              .pipe(
                map(snapshot => snapshot.docs.map(doc => this.createEntityFromDoc(doc as QueryDocumentSnapshot<Entity>))),
                map(entities => entities.filter(entity => !!entity) as Entity[]),
              );
          } else {
            return of([]);
          }
        }),
      );
  }

  private changedEntitiesForUser(user: User, type: 'added' | 'modified',
                                 queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    const collection = this.afs.collection<Entity>(this.getCollectionPath(user.id));
    const action$ = this.afs.collection<Entity>(collection.ref, this.wrapQuery(queryFn)).stateChanges([type]);
    return this.createEntitiesForUser(action$);
  }

  private createEntitiesForUser(action$: Observable<DocumentChangeAction<Entity>[]>): Observable<Entity[]> {
    return action$
      .pipe(
        switchMap(changes => Promise.all(changes.map(doc => this.createEntityFromDoc(doc.payload.doc)))),
        map(entities => entities.filter(entity => !!entity) as Entity[]),
      );
  }

  private deletedEntitiesForUser(user: User): Observable<string[]> {
    return this.afs.collection<Entity>(this.getCollectionPath(user.id)).stateChanges(['removed'])
      .pipe(
        map(changes => changes.map(change => change.payload.doc.id)),
      );
  }

  private createEntityFromDoc(doc: QueryDocumentSnapshot<Entity> | DocumentSnapshot<Entity>): Entity | undefined {

    if (doc.exists) {
      return doc.data();
    } else {
      return undefined;
    }
  }

  private wrapQuery(queryFn?: QueryFunction<FireStoreQuery<Entity>>): QueryFn | undefined {
    if (queryFn) {
      return ref => {
        const query = queryFn(new FireStoreQuery(ref));
        return query.ref;
      };
    }
    return undefined;
  }

  private getCollectionPath(userId: string): string {
    return `users/${userId}/${this.collection}`;
  }

}
