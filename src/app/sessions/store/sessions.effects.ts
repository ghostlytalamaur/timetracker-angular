import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { EntitiesActions } from './entities';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SessionEntity } from '../model/session-entity';
import { Injectable } from '@angular/core';
import { from, merge, Observable, of } from 'rxjs';
import * as fromSessions from '../store';
import { SessionsStorageService } from '../services/sessions-storage.service';
import { Update } from '../services/entity-storage';
import { Range } from '../../shared/utils';
import { DateTime } from 'luxon';

@Injectable()
export class SessionsEffects {

  loadEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(EntitiesActions.loadSessions),
        switchMap(ignored => this.getChangesActions())
      )
  );

  addSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(EntitiesActions.addSession),
        switchMap(action => this.handleAddSession(action.session))
      )
  );

  addSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(EntitiesActions.addSessions),
        switchMap(action => this.handleAddSessions(action.sessions))
      )
  );

  updateSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(EntitiesActions.updateSessions),
        switchMap(action => this.handleUpdateSessions(action.changes))
      )
  );

  removeSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(EntitiesActions.removeSession),
        switchMap(action => this.handleRemoveSession(action.id))
      )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<fromSessions.State>,
    private readonly storage: SessionsStorageService
  ) {
  }

  private handleAddSessions(sessions: SessionEntity[]): Observable<Action> {
    return this.wrapVoid(this.storage.addSessions(sessions), 'Cannot add sessions.');
  }

  private handleAddSession(session: SessionEntity): Observable<Action> {
    return this.wrapVoid(this.storage.addSession(session), 'Cannot add session.');
  }

  private handleUpdateSessions(changes: Update<SessionEntity>[]): Observable<Action> {
    return this.wrapVoid(this.storage.updateSessions(changes), 'Cannot update session.');
  }

  private handleRemoveSession(id: string): Observable<Action> {
    return this.wrapVoid(this.storage.removeSession(id), 'Cannot remove session.');
  }

  private wrapVoid(promise: Promise<any>, msg: string): Observable<Action> {
    const stream$ = from(promise)
      .pipe(
        map(() => ({ type: 'DUMMY ACTION' }))
      );
    return this.catchError(stream$, msg);
  }

  private getChangesActions(): Observable<Action> {
    const changes$ = this.store.select(fromSessions.getDisplayRange)
      .pipe(
        switchMap(range => {
          return merge(
            this.getAddedSessions(range),
            this.getRemovedSessions(),
            this.getModifiedSessions(range)
          );
        })
      );

    return this.catchError(changes$, '');
  }

  private catchError(stream: Observable<Action>, msg: string): Observable<Action> {
    return stream
      .pipe(
        catchError(err => {
          console.log(err);
          const message = err instanceof Error ? err.message : msg + JSON.stringify(err);
          return of(EntitiesActions.sessionsError({ message }));
        })
      );
  }

  private getAddedSessions(range: Range<DateTime>): Observable<Action> {
    return this.storage.addedSessions(range)
      .pipe(
        map(sessions => EntitiesActions.sessionsAdded({ sessions }))
      );
  }

  private getRemovedSessions(): Observable<Action> {
    return this.storage.removedSessions()
      .pipe(
        map(ids => EntitiesActions.sessionsRemoved({ ids }))
      );
  }

  private getModifiedSessions(range: Range<DateTime>): Observable<Action> {
    return this.storage.modifiedSessions(range)
      .pipe(
        map(sessions => EntitiesActions.sessionsModified({ sessions }))
      );
  }

}
