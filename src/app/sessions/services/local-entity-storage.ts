import { Observable, of, Subject } from 'rxjs';
import { map, mergeMap, startWith, switchMap } from 'rxjs/operators';
import { EntityStorage, Update } from './entity-storage';

export class LocalEntityStorage<Entity extends { id: string }> implements EntityStorage<Entity> {
  private entitiesMap: { [id: string]: Entity } = {};
  private readonly added = new Subject<Entity[]>();
  private readonly modified = new Subject<Entity[]>();
  private readonly deleted = new Subject<string[]>();

  constructor(
    private readonly collection: string
  ) {
  }

  addedEntities(): Observable<Entity[]> {
    return of([])
      .pipe(
        switchMap(() => this.loadEntities()),
        map(() => Object.keys(this.entitiesMap).map(id => this.entitiesMap[id])),
        mergeMap(sessions => this.added.pipe(startWith(sessions)))
      );
  }

  modifiedEntities(): Observable<Entity[]> {
    return this.modified.asObservable();
  }

  removedEntities(): Observable<string[]> {
    return this.deleted.asObservable();
  }


  async addEntities(...sessions: Entity[]): Promise<void> {
    for (const entity of sessions) {
      this.entitiesMap[entity.id] = entity;
    }

    if (sessions.length) {
      await this.storeEntities();
      this.added.next(sessions);
    }
  }

  async updateEntities(...changes: Update<Entity>[]): Promise<void> {
    const entities: Entity[] = [];
    for (const change of changes) {
      this.entitiesMap[change.id] = {
        ...this.entitiesMap[change.id],
        ...change
      };
      entities.push(this.entitiesMap[change.id]);
    }

    if (entities.length) {
      await this.storeEntities();
      this.modified.next(entities);
    }
  }

  async deleteEntities(...ids: string[]): Promise<void> {
    for (const id of ids) {
      delete this.entitiesMap[id];
    }

    if (ids.length) {
      await this.storeEntities();
      this.deleted.next(ids);
    }
  }

  private async loadEntities(): Promise<void> {
    const sessionsStr = localStorage.getItem(this.collection);
    if (sessionsStr) {
      this.entitiesMap = JSON.parse(sessionsStr);
      const sessions = Object.keys(this.entitiesMap).map(id => this.entitiesMap[id]);
      this.added.next(sessions);
    }
  }

  private async storeEntities(): Promise<void> {
    localStorage.setItem(this.collection, JSON.stringify(this.entitiesMap));
  }

}
