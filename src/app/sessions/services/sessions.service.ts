import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';
import { Update } from './entity-storage';
import { Range } from '../../shared/utils';
import { DateTime } from 'luxon';
import { Session, SessionEntity, SessionsGroup, SessionsGroupType, SortType } from '../models';
import { SessionsFeatureSelectors } from '../store/selectors';
import { SessionsActions, SettingsActions } from '../store/actions';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly store: Store<object>,
  ) {
  }

  getSessions(): Observable<Session[]> {
    return this.store.select(SessionsFeatureSelectors.getSessions);
  }

  getSession(id: string): Observable<Session | undefined> {
    return this.store.select(SessionsFeatureSelectors.getSession(id));
  }

  hasRunningSessions(): Observable<boolean> {
    return this.store.select(SessionsFeatureSelectors.hasRunningSessions);
  }

  isLoading(): Observable<boolean> {
    return this.store.select(SessionsFeatureSelectors.isLoading);
  }

  getError(): Observable<string> {
    return this.store.select(SessionsFeatureSelectors.getError);
  }

  getGroupType(): Observable<SessionsGroupType> {
    return this.store.select(SessionsFeatureSelectors.getGroupType);
  }

  getSessionGroups(): Observable<SessionsGroup[]> {
    return this.store.select(SessionsFeatureSelectors.getSessionsGroups);
  }

  getSortType(): Observable<SortType> {
    return this.store.select(SessionsFeatureSelectors.getSortType);
  }

  loadSessions(): void {
    this.store.select(SessionsFeatureSelectors.isLoaded)
      .pipe(
        take(1),
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
    this.store.select(SessionsFeatureSelectors.getRunningSessions)
      .pipe(
        take(1),
        map((sessions: Session[]) => {
          if (sessions.length > 0) {
            const now = DateTime.local();
            const changes = sessions.map<Update<SessionEntity>>(s =>
              ({
                id: s.id,
                duration: now.valueOf() - s.start.valueOf(),
              }),
            );
            return SessionsActions.updateSessions({ changes });
          } else {
            const session = Session.fromNow(uuid()).toEntity();
            return SessionsActions.addSession({ session });
          }
        }),
      )
      .subscribe(
        action => this.store.dispatch(action),
      );
  }

  clearError() {
    this.store.dispatch(SessionsActions.clearError());
  }

  getDisplayRange(): Observable<Range<DateTime>> {
    return this.store.select(SessionsFeatureSelectors.getDisplayRange);
  }

  setDisplayRange(range: Range<DateTime>): void {
    this.store.dispatch(SettingsActions.setDisplayRange({
      start: range.start.valueOf(),
      end: range.end.valueOf(),
    }));
  }

  changeGroupType(group: SessionsGroupType) {
    this.store.dispatch(SettingsActions.changeGroupType({ group }));
  }

  changeSortType(sortType: SortType) {
    this.store.dispatch(SettingsActions.changeSortType({ sortType }));
  }
}
