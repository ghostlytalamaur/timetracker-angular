import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromSessions from './store';
import { Observable } from 'rxjs';
import { createSession, SessionEntity } from './model/session-entity';
import { SessionsActions } from './store/actions';
import { UpdateStr } from '@ngrx/entity/src/models';
import { map, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Session } from './model/session';

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

  loadSessions(): void {
    this.store.dispatch(SessionsActions.loadSessions());
  }

  addSession(session: SessionEntity): void {
    this.store.dispatch(SessionsActions.addSession({ session }));
  }

  updateSession(changes: UpdateStr<SessionEntity>): void {
    this.store.dispatch(SessionsActions.updateSession({ changes }));
  }

  removeSession(id: string): void {
    this.store.dispatch(SessionsActions.removeSession({ id }));
  }

  toggleSession(): void {
    this.store.select(fromSessions.getRunningSessions)
      .pipe(
        take(1),
        map((sessions: Session[]) => {
          const date = new Date().toString();
          if (sessions.length > 0) {
            const changes = sessions.map<UpdateStr<SessionEntity>>(s => ({ id: s.id, changes: { end: date } }));
            return SessionsActions.updateSessions({ changes });
          } else {
            const session = createSession(uuid(), date, null);
            return SessionsActions.addSession({ session });
          }
        })
      )
      .subscribe(
        action => this.store.dispatch(action)
      );
  }
}
