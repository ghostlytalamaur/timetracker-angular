import { Injectable } from '@angular/core';
import { Status } from '@app/shared/types';
import { Range } from '@app/shared/utils';
import { Store } from '@ngrx/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { SessionsActions, SettingsActions } from '../actions';
import { Session, SessionEntity, SessionsGroupType, SortType, Update } from '../models';
import { SessionsSelectors, SettingsSelectors } from '../selectors';


@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  constructor(
    private readonly store: Store,
  ) {
  }

  getSessions(): Observable<Session[]> {
    return this.store.select(SessionsSelectors.selectSessions);
  }

  getSession(id: string): Observable<Session | undefined> {
    return this.store.select(SessionsSelectors.selectSession(id));
  }

  hasRunningSessions(): Observable<boolean> {
    return this.store.select(SessionsSelectors.selectHasRunningSessions);
  }

  getStatus(): Observable<Status> {
    return this.store.select(SessionsSelectors.selectStatus);
  }

  getGroupType(): Observable<SessionsGroupType> {
    return this.store.select(SettingsSelectors.selectGroupType);
  }

  getSortType(): Observable<SortType> {
    return this.store.select(SettingsSelectors.selectSortType);
  }

  requestSessions(): void {
    this.store.select(SessionsSelectors.selectIsLoaded)
      .pipe(
        take(1),
      )
      .subscribe(isLoaded => {
        if (!isLoaded) {
          this.store.dispatch(SessionsActions.requestSessions());
        }
      });
  }

  cancelRequestSessions(): void {
    this.store.dispatch(SessionsActions.cancelRequestSessions());
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

  removeSessions(ids: string[]): void {
    this.store.dispatch(SessionsActions.removeSessions({ ids }));
  }

  copyGroupToClipboard(groupId: string): void {
    this.store.dispatch(SessionsActions.copyGroupToClipboard({ groupId }));
  }

  toggleSession(): void {
    this.store.select(SessionsSelectors.selectRunningSessions)
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
    return this.store.select(SettingsSelectors.selectDisplayRange);
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

  toggleSessionTag(sessionId: string, tagId: string): void {
    this.store.dispatch(SessionsActions.toggleSessionTag({ sessionId, tagId }));
  }
}
