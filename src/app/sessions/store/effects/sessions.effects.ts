import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable, from, merge, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { Range } from '../../../shared/utils';
import { SessionEntity } from '../../models';
import { Update } from '../../services/entity-storage';
import { SessionsStorageService } from '../../services/sessions-storage.service';
import { SessionsActions } from '../actions';
import { SessionsFeatureSelectors } from '../selectors';

@Injectable()
export class SessionsEffects {

  loadEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.loadSessions),
        switchMap(ignored => this.getChangesActions()),
      ),
  );

  addSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSession),
        switchMap(action => this.handleAddSession(action.session)),
      ),
  );

  addSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSessions),
        switchMap(action => this.handleAddSessions(action.sessions)),
      ),
  );

  updateSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.updateSessions),
        switchMap(action => this.handleUpdateSessions(action.changes)),
      ),
  );

  removeSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.removeSession),
        switchMap(action => this.handleRemoveSession(action.id)),
      ),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<object>,
    private readonly storage: SessionsStorageService,
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
        map(() => ({ type: 'DUMMY ACTION' })),
      );
    return this.catchError(stream$, msg);
  }

  private getChangesActions(): Observable<Action> {
    const changes$ = this.store.select(SessionsFeatureSelectors.getDisplayRange)
      .pipe(
        switchMap(range => {
          return merge(
            this.getAddedSessions(range),
            this.getRemovedSessions(),
            this.getModifiedSessions(range),
          );
        }),
      );

    return this.catchError(changes$, '');
  }

  private catchError(stream: Observable<Action>, msg: string): Observable<Action> {
    return stream
      .pipe(
        catchError(err => {
          console.log(err);
          const message = err instanceof Error ? err.message : msg + JSON.stringify(err);
          return of(SessionsActions.sessionsError({ message }));
        }),
      );
  }

  private getAddedSessions(range: Range<DateTime>): Observable<Action> {
    return this.storage.addedSessions(range)
      .pipe(
        map(sessions => SessionsActions.sessionsAdded({ sessions })),
      );
  }

  private getRemovedSessions(): Observable<Action> {
    return this.storage.removedSessions()
      .pipe(
        map(ids => SessionsActions.sessionsRemoved({ ids })),
      );
  }

  private getModifiedSessions(range: Range<DateTime>): Observable<Action> {
    return this.storage.modifiedSessions(range)
      .pipe(
        map(sessions => SessionsActions.sessionsModified({ sessions })),
      );
  }

}
