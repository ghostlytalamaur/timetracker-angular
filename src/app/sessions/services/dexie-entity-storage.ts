import { EntityQuery, EntityStorage, EntityType, OrderByDirection, Update, WhereFilterOp } from './entity-storage';
import Dexie from 'dexie';
import { merge, Observable, Subject } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap } from 'rxjs/operators';

type QueryOperator<E> = (entity: E) => boolean;

class DexieStorageQuery<E> implements EntityQuery<E> {

  private readonly operators: QueryOperator<E>[] = [];

  where<K extends keyof E & string>(field: K, operation: WhereFilterOp, value: E[K]): this {
    const op = (entity: E): boolean => {
      const v = entity[field];
      switch (operation) {
        case '<':
          return v < value;
        case '<=':
          return v <= value;
        case '==':
          return v === value;
        case '>':
          return v > value;
        case '>=':
          return v >= value;
        case 'array-contains':
          return Array.isArray(v) ? v.find(arrayValue => arrayValue === value) : false;
      }
    };
    this.operators.push(op);
    return this;
  }

  orderBy<K extends keyof E & string>(field: K, direction?: OrderByDirection): this {
    return this;
  }

  limit(limit: number): this {
    return this;
  }

  apply(collection: Dexie.Collection<E, string>): Dexie.Collection<E, string> {
    for (const op of this.operators) {
      collection = collection.and(op);
    }
    return collection;
  }
}

export class DexieEntityStorage<Entity extends EntityType> implements EntityStorage<Entity, DexieStorageQuery<Entity>> {

  private readonly addedEntities$: Subject<string[]>;
  private readonly modifiedEntities$: Subject<string[]>;
  private readonly deletedEntities$: Subject<string[]>;

  constructor(
    private readonly db: Dexie,
    private readonly table: Dexie.Table<Entity, string>
  ) {
    this.addedEntities$ = new Subject<string[]>();
    this.modifiedEntities$ = new Subject<string[]>();
    this.deletedEntities$ = new Subject<string[]>();
  }


  addEntities(...entities: Entity[]): Promise<void> {
    return this.table.bulkAdd(entities).then(() => {
      this.addedEntities$.next(entities.map(entity => entity.id));
    });
  }

  updateEntities(...changes: Update<Entity>[]): Promise<void> {
    return this.db.transaction('rw', this.table, () => {
      return Promise.all(changes.map(change => this.table.update(change.id, change)));
    })
      .then(() => {
        this.modifiedEntities$.next(changes.map(change => change.id));
      });
  }

  deleteEntities(...ids: string[]): Promise<void> {
    return this.table.bulkDelete(ids)
      .then(() => {
        this.deletedEntities$.next(ids);
      });
  }

  addedEntities(queryFn?: <Q>(query: DexieStorageQuery<Entity>) => DexieStorageQuery<Entity>): Observable<Entity[]> {
    return merge(
      this.loadEntities(this.table.toCollection(), queryFn),
      this.addedEntities$
        .pipe(
          switchMap(ids => {
            const collection = this.table.where('id').anyOf(ids);
            return this.loadEntities(collection, queryFn);
          })
        )
    );
  }

  modifiedEntities(queryFn?: <Q>(query: DexieStorageQuery<Entity>) => DexieStorageQuery<Entity>): Observable<Entity[]> {
    return this.modifiedEntities$
      .pipe(
        switchMap(ids => {
          const collection = this.table.where('id').anyOf(ids);
          return this.loadEntities(collection, queryFn);
        })
      );
  }

  deletedEntities(): Observable<string[]> {
    return this.deletedEntities$.asObservable();
  }

  private loadEntities(collection: Dexie.Collection<Entity, string>,
                       queryFn?: <Q>(query: DexieStorageQuery<Entity>) => DexieStorageQuery<Entity>): Observable<Entity[]> {
    if (queryFn) {
      const query = queryFn(new DexieStorageQuery<Entity>());
      collection = query.apply(collection);
    }

    return fromPromise(collection.toArray());
  }

}
