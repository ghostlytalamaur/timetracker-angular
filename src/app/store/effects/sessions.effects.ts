import { Injectable } from '@angular/core';
import { NotificationsService } from '@app/core/services';
import { getErrorMessage } from '@app/shared/types';
import { Range } from '@app/shared/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { EMPTY, Observable, OperatorFunction, merge, of } from 'rxjs';
import { catchError, finalize, map, mergeMap, switchMap, switchMapTo, take, takeUntil, tap } from 'rxjs/operators';

import { SessionsActions } from '../actions';
import { SessionsSelectors, SettingsSelectors } from '../selectors';
// noinspection ES6PreferShortImport
import { SessionsStorageService } from '../services';

function isAction(value: unknown): value is Action {
  return typeof value === 'object' && value !== null && 'type' in value && typeof (value as any).type === 'string';
}

function handleSessionError<T>(msg: string): OperatorFunction<T, Action> {
  return source => source
    .pipe(
      switchMap(maybeAction => isAction(maybeAction) ? of(maybeAction) : EMPTY),
      catchError(err => {
        const message = msg ? `${msg}\n${getErrorMessage(err)}` : getErrorMessage(err);

        return of(SessionsActions.sessionsError({ message }));
      }),
      finalize(() => console.log('unsubscribe')),
    );
}

@Injectable()
export class SessionsEffects {

  public loadEffect$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.requestSessions),
        switchMap(() => {
            const requested$ = this.actions$
              .pipe(
                ofType(SessionsActions.cancelRequestSessions),
              );

            return this.getChangesActions()
              .pipe(
                takeUntil<Action>(requested$),
              )
          },
        ),
      ),
  );

  public addSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSession),
        switchMap(action =>
          this.storage.addSession(action.session)
            .pipe(
              handleSessionError('Cannot add session'),
            ),
        ),
      ),
  );

  public addSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSessions),
        switchMap(action =>
          this.storage.addSessions(action.sessions)
            .pipe(
              handleSessionError('Cannot add sessions'),
            ),
        ),
      ),
  );

  public updateSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.updateSessions),
        switchMap(action =>
          this.storage.updateSessions(action.changes)
            .pipe(
              handleSessionError('Cannot update sessions'),
            ),
        ),
      ),
  );

  public toggleSessionTags$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.toggleSessionTag),
        mergeMap(({ sessionId, tagId }) => {
          return this.store.select(SessionsSelectors.selectSessionEntity(sessionId))
            .pipe(
              take(1),
              switchMap(session => {
                if (session) {
                  const notificationId = this.notifications.info('Updating session...');
                  return this.storage.updateSessionTags({
                    sessionId, tagId,
                    append: session.tags.includes(tagId),
                  })
                    .pipe(
                      tap(() => {
                        this.notifications.clear(notificationId);
                        this.notifications.success('Session was updated')
                      }),
                      switchMapTo(EMPTY),
                      catchError(() => {
                        this.notifications.clear(notificationId);
                        this.notifications.error('Unable to update session');

                        return of(SessionsActions.toggleSessionTagFailure({ sessionId, tagId }));
                      }),
                    );
                } else {
                  return EMPTY;
                }
              }),
            );
        }),
      ),
  );

  public removeSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.removeSessions),
        switchMap(action =>
          this.storage.removeSessions(action.ids)
            .pipe(
              handleSessionError('Cannot remove session'),
            ),
        ),
      ),
  );

  public constructor(
    private readonly actions$: Actions,
    private readonly store: Store,
    private readonly storage: SessionsStorageService,
    private readonly notifications: NotificationsService,
  ) {
  }

  private getChangesActions(): Observable<Action> {
    return this.store.select(SettingsSelectors.selectDisplayRange)
      .pipe(
        switchMap(range => {
          return merge(
            this.getAddedSessions(range),
            this.getRemovedSessions(),
            this.getModifiedSessions(range),
          )
            .pipe(
              handleSessionError(''),
            );
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
