import { Observable } from 'rxjs';

export interface EntityType {
  id: string;
}

export type Update<T> = EntityType & Partial<T>;

export type WhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
export type OrderByDirection = 'desc' | 'asc';
export type QueryFunction<Q extends EntityQuery<unknown>> = (query: Q) => Q;

export interface EntityQuery<E> {
  where<K extends keyof E & string>(field: K, operation: WhereFilterOp, value: E[K]): this;

  orderBy<K extends keyof E & string>(field: K, direction?: OrderByDirection): this;

  limit(limit: number): this;
}

export interface EntityStorage<Entity extends EntityType, Q extends EntityQuery<Entity>> {
  /**
   *  Emits each added entities. For the first time load entities from underlying storage.
   */
  addedEntities(queryFn?: QueryFunction<Q>): Observable<Entity[]>;

  /**
   * Emits each modified entities.
   */
  modifiedEntities(queryFn?: QueryFunction<Q>): Observable<Entity[]>;

  /**
   * Emits ids of removed entities
   */
  deletedEntities(): Observable<string[]>;

  /**
   * Add entities to storage
   */
  addEntities(...entities: Entity[]): Promise<void>;

  /**
   * Update entities. Merge existing entities with changes.
   */
  updateEntities(...changes: Update<Entity>[]): Promise<void>;

  /**
   * Delete entities with ids from storage
   */
  deleteEntities(...ids: string[]): Promise<void>;
}
