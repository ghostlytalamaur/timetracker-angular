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
          const now = new Date();
          if (sessions.length > 0) {
            const changes = sessions.map<Update<SessionEntity>>(s =>
              ({
                id: s.id,
                end: now.toTimeString()
              })
            );
            return SessionsActions.updateSessions({ changes });
          } else {
            const session = new Session(uuid(), now, now, null).toEntity();
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
}
