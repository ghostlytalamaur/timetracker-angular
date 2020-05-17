import {
  AngularFirestore,
  DocumentChangeAction,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  QueryFn,
} from '@angular/fire/firestore';
import { AuthService, User } from '@app/core/auth';
import { isDefined } from '@app/shared/utils/guards';
import { Observable, merge, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { EntityType, Update } from '../models';

export type WhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
export type OrderByDirection = 'desc' | 'asc';
export type QueryFunction<Q extends FireStoreQuery<unknown>> = (query: Q) => Q;

export class FireStoreQuery<E> {
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

export class FireEntityStorage<Entity extends EntityType> {

  public constructor(
    private readonly afs: AngularFirestore,
    protected readonly authService: AuthService,
    private readonly collection: string,
  ) {
  }

  protected addedEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return merge(
      this.loadEntities(queryFn),
      this.changedEntities('added', queryFn),
    );
  }

  protected modifiedEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.changedEntities('modified', queryFn);
  }

  protected deletedEntities(): Observable<string[]> {
    return this.withUser(user => this.deletedEntitiesForUser(user));
  }

  protected deleteEntities(...ids: string[]): Observable<void> {
    return this.withUser((user) => {
      const promises: Promise<void>[] = [];
      for (const id of ids) {
        const promise = this.afs
          .collection<Entity>(this.getCollectionPath(user.id))
          .doc(id)
          .delete();
        promises.push(promise);
      }

      return Promise.all(promises).then();
    });
  }

  protected updateEntities(...changes: Update<Entity>[]): Observable<void> {
    return this.withUser((user) => {
      const promises: Promise<void>[] = [];
      const collection = this.getCollectionPath(user.id);
      for (const change of changes) {
        const res = this.afs.collection<Entity>(collection)
          .doc(change.id)
          .update(change);
        promises.push(res);
      }

      return Promise.all(promises).then();
    });
  }

  protected addEntities(...entities: Entity[]): Observable<void> {
    return this.withUser((user) => {
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
    });
  }

  private withUser<T>(fn: (user: User) => Observable<T> | Promise<T>): Observable<T> {
    return this.authService.user$
      .pipe(
        switchMap(user => user ? fn(user) : throwError(new Error('Not authenticated'))),
      )
  }

  private changedEntities(type: 'added' | 'modified', queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.withUser(user => this.changedEntitiesForUser(user, type, queryFn));
  }

  private loadEntities(queryFn?: QueryFunction<FireStoreQuery<Entity>>): Observable<Entity[]> {
    return this.withUser(user => {
      const collection = this.afs.collection<Entity>(this.getCollectionPath(user.id));
      return this.afs.collection<Entity>(collection.ref, this.wrapQuery(queryFn))
        .get()
        .pipe(
          map(snapshot =>
            snapshot.docs
              .map(doc => this.createEntityFromDoc(doc as QueryDocumentSnapshot<Entity>))
              .filter(isDefined),
          ),
        );
    });
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
        switchMap(changes => Promise.all(
          changes
            .map(doc => this.createEntityFromDoc(doc.payload.doc))
            .filter(isDefined),
          ),
        ),
      );
  }

  private deletedEntitiesForUser(user: User): Observable<string[]> {
    return this.afs.collection<Entity>(this.getCollectionPath(user.id)).stateChanges(['removed'])
      .pipe(
        map(changes => changes.map(change => change.payload.doc.id)),
      );
  }

  private createEntityFromDoc(doc: QueryDocumentSnapshot<Entity> | DocumentSnapshot<Entity>): Entity | null {
    if (doc.exists) {
      return doc.data();
    } else {
      return null;
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
