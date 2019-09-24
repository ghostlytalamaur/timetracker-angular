import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSessions from './store';
import { Observable } from 'rxjs';
import { SessionEntity } from './model/session-entity';
import { SessionsActions } from './store/actions';
import { map, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Session } from './model/session';
import { Update } from './services/entity-storage';
import { Range } from '../shared/utils';
import { DateTime } from 'luxon';
import { SessionsGroup, SessionsGroupType } from './model/sessions-group';

@Injectable({
  providedIn: 'root'
})
export class SessionsService {
  constructor(
    private readonly store: Store<fromSessions.State>
  ) {
  }

  getSessions(): Observable<Session[]> {
    return this.store.select(fromSessions.getSessions);
  }

  getSession(id: string): Observable<Session | undefined> {
    return this.store.select(fromSessions.getSession(id));
  }

  hasRunningSessions(): Observable<boolean> {
    return this.store.select(fromSessions.hasRunningSessions);
  }

  isLoading(): Observable<boolean> {
    return this.store.select(fromSessions.isLoading);
  }

  getError(): Observable<string> {
    return this.store.select(fromSessions.getError);
  }

  getGroupType(): Observable<SessionsGroupType> {
    return this.store.select(fromSessions.getGroupType);
  }

  getSessionGroups(): Observable<SessionsGroup[]> {
    return this.store.select(fromSessions.getSessionsGroups);
  }

  loadSessions(): void {
    this.store.select(fromSessions.isLoaded)
      .pipe(
        take(1)
      )
      .subscribe(isLoaded => {
        if (!isLoaded) {
          this.store.dispatch(SessionsActions.loadSessions());
        }
      });
  }

  addSession(session: SessionEntity): void {
    this.store.dispatch(SessionsActions.addSession({ session }));
  }

  addSessions(sessions: SessionEntity[]): void {
    this.store.dispatch(SessionsActions.addSessions({ sessions }));
  }

  updateSession(changes: Update<SessionEntity>): void {
    this.store.dispatch(SessionsActions.updateSessions({ changes: [changes] }));
  }

  removeSession(id: string): void {
    this.store.dispatch(SessionsActions.removeSession({ id }));
  }

  toggleSession(): void {
    this.store.select(fromSessions.getRunningSessions)
      .pipe(
        take(1),
        map((sessions: Session[]) => {
          if (sessions.length > 0) {
            const now = DateTime.local();
            const changes = sessions.map<Update<SessionEntity>>(s =>
              ({
                id: s.id,
                duration: now.valueOf() - s.start.valueOf()
              })
            );
            return SessionsActions.updateSessions({ changes });
          } else {
            const session = Session.fromNow(uuid()).toEntity();
            return SessionsActions.addSession({ session });
          }
        })
      )
      .subscribe(
        action => this.store.dispatch(action)
      );
  }

  clearError() {
    this.store.dispatch(SessionsActions.clearError());
  }

  getDisplayRange(): Observable<Range<DateTime>> {
    return this.store.select(fromSessions.getDisplayRange);
  }

  setDisplayRange(range: Range<DateTime>): void {
    this.store.dispatch(SessionsActions.setDisplayRange({
      start: range.start.valueOf(),
      end: range.end.valueOf()
    }));
  }

  changeGroupType(group: SessionsGroupType) {
    this.store.dispatch(SessionsActions.changeGroupType({ group }));
  }
}
