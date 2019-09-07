import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { SessionsActions } from './actions';
import { map, switchMap, take } from 'rxjs/operators';
import { Session } from '../model/session';
import { Injectable } from '@angular/core';
import { UpdateStr } from '@ngrx/entity/src/models';
import { Observable, of } from 'rxjs';
import * as fromSessions from '../store';

@Injectable()
export class SessionsEffects {

  addSession$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.addSession),
        switchMap(action => this.handleAddSession(action.session))
      )
  );

  updateSessions$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(SessionsActions.updateSessions),
        switchMap(action => this.handleUpdateSessions(action.changes))
      )
  );

  constructor(
    private readonly actions$: Actions,
    private readonly store: Store<fromSessions.State>
  ) {
  }

  private handleAddSession(session: Session): Observable<Action> {
    return of(SessionsActions.sessionsAdded({ sessions: [session] }));
  }

  private handleUpdateSessions(changes: UpdateStr<Session>[]): Observable<Action> {
    const changesMap = new Map<string, UpdateStr<Session>>(changes.map(change => [change.id, change]));
    return this.store.select(fromSessions.getSessions)
      .pipe(
        take(1),
        map(sessions =>
          sessions.filter(s => changesMap.has(s.id))
            .map(s => {
              const c = changesMap.get(s.id);
              const sessionChanges = c ? c.changes : {};
              return { ...s, ...sessionChanges };
            })
        ),
        map(updatedSessions => SessionsActions.sessionsModified({ sessions: updatedSessions }))
      );
  }
}
