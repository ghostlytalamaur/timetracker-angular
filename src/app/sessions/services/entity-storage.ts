import { Observable } from 'rxjs';

export interface EntityType {
  id: string;
}

export type Update<T> = EntityType & Partial<T>;

export interface EntityStorage<Entity extends EntityType> {
  /**
   *  Emits each added entities. For the first time load entities from underlying storage.
   */
  addedEntities(): Observable<Entity[]>;

  /**
   * Emits each modified entities.
   */
  modifiedEntities(): Observable<Entity[]>;

  /**
   * Emits ids of removed entities
   */
  removedEntities(): Observable<string[]>;

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
