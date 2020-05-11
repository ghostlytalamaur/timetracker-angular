import { Inject, Injectable } from '@angular/core';
import { Range } from '@app/shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { EMPTY, Observable, from, merge, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { SessionsActions } from '../actions';
import { SessionEntity, Update } from '../models';
import { SessionsSelectors, SettingsSelectors } from '../selectors';
// noinspection ES6PreferShortImport
import { SESSIONS_STORAGE, SessionsStorage } from '../services';

@Injectable()
export class SessionsEffects {

  public loadEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.loadSessions),
        switchMap(ignored => this.getChangesActions()),
      ),
  );

  public addSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSession),
        switchMap(action => this.handleAddSession(action.session)),
      ),
  );

  public addSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSessions),
        switchMap(action => this.handleAddSessions(action.sessions)),
      ),
  );

  public updateSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.updateSessions),
        switchMap(action => this.handleUpdateSessions(action.changes)),
      ),
  );

  public toggleSessionTags$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.toggleSessionTag),
        mergeMap(({ sessionId, tagId }) => {
          return this.store.select(SessionsSelectors.selectSession(sessionId))
            .pipe(
              take(1),
              switchMap(session => {
                if (session) {
                  return this.handleUpdateSessions([{
                    id: session.id,
                    tags: session.tags.map(t => t.id),
                  }]);
                } else {
                  return EMPTY;
                }
              }),
              catchError(() => of(SessionsActions.toggleSessionTagFailure({ sessionId, tagId }))),
            );
        }),
      ),
  );

  public removeSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.removeSessions),
        switchMap(action => this.handleRemoveSession(action.ids)),
      ),
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    @Inject(SESSIONS_STORAGE) private readonly storage: SessionsStorage,
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

  private handleRemoveSession(ids: string[]): Observable<Action> {
    return this.wrapVoid(this.storage.removeSessions(ids), 'Cannot remove session.');
  }

  private wrapVoid(promise: Promise<any>, msg: string): Observable<Action> {
    const stream$ = from(promise)
      .pipe(
        map(() => ({ type: 'DUMMY ACTION' })),
      );
    return this.catchError(stream$, msg);
  }

  private getChangesActions(): Observable<Action> {
    const changes$ = this.store.select(SettingsSelectors.selectDisplayRange)
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
