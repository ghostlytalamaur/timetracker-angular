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
  public constructor(
    private readonly store: Store,
  ) {
  }

  public getSessions(): Observable<Session[]> {
    return this.store.select(SessionsSelectors.selectSessions);
  }

  public getSession(id: string): Observable<Session | undefined> {
    return this.store.select(SessionsSelectors.selectSession(id));
  }

  public hasRunningSessions(): Observable<boolean> {
    return this.store.select(SessionsSelectors.selectHasRunningSessions);
  }

  public getStatus(): Observable<Status> {
    return this.store.select(SessionsSelectors.selectStatus);
  }

  public getGroupType(): Observable<SessionsGroupType> {
    return this.store.select(SettingsSelectors.selectGroupType);
  }

  public getSortType(): Observable<SortType> {
    return this.store.select(SettingsSelectors.selectSortType);
  }

  public loadSessions(): void {
    this.store.select(SessionsSelectors.selectIsLoaded)
      .pipe(
        take(1),
      )
      .subscribe(isLoaded => {
        if (!isLoaded) {
          this.store.dispatch(SessionsActions.loadSessions());
        }
      });
  }

  public addSession(session: SessionEntity): void {
    this.store.dispatch(SessionsActions.addSession({ session }));
  }

  public addSessions(sessions: SessionEntity[]): void {
    this.store.dispatch(SessionsActions.addSessions({ sessions }));
  }

  public updateSession(changes: Update<SessionEntity>): void {
    this.store.dispatch(SessionsActions.updateSessions({ changes: [changes] }));
  }

  public removeSessions(ids: string[]): void {
    this.store.dispatch(SessionsActions.removeSessions({ ids }));
  }

  public toggleSession(): void {
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

  public clearError() {
    this.store.dispatch(SessionsActions.clearError());
  }

  public getDisplayRange(): Observable<Range<DateTime>> {
    return this.store.select(SettingsSelectors.selectDisplayRange);
  }

  public setDisplayRange(range: Range<DateTime>): void {
    this.store.dispatch(SettingsActions.setDisplayRange({
      start: range.start.valueOf(),
      end: range.end.valueOf(),
    }));
  }

  public changeGroupType(group: SessionsGroupType) {
    this.store.dispatch(SettingsActions.changeGroupType({ group }));
  }

  public changeSortType(sortType: SortType) {
    this.store.dispatch(SettingsActions.changeSortType({ sortType }));
  }
}
