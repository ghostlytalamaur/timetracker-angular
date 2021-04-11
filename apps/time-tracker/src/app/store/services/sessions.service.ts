import { Injectable } from '@angular/core';
import { EventsService, ClientService } from '@app/core/services';
import { generateUUID, Range, select$, StateOperator } from '@app/shared/utils';
import { initialStatus, Nullable, applyStateOperator, LoadableState, LoadableStore } from '@app/shared/utils';
import { EventType, ISession } from '@timetracker/shared';
import { DateTime } from 'luxon';
import { combineLatest, merge, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { isRunning, Session, SessionsGroupType, SortType, Update } from '../models';
import { SessionsTagsService } from './sessions-tags.service';

interface SessionsState extends LoadableState<ISession[]> {
  displayRange: Range<DateTime>;
  groupType: SessionsGroupType;
  sortType: SortType;
}

@Injectable({
  providedIn: 'root',
})
export class SessionsService extends LoadableStore<ISession[], SessionsState> {

  constructor(
    private readonly client: ClientService,
    private readonly events: EventsService,
    private readonly tags: SessionsTagsService,
  ) {
    super({
      data: undefined,
      status: initialStatus(),
      displayRange: {
        start: DateTime.local().startOf('month'),
        end: DateTime.local().endOf('month'),
      },
      groupType: 'none',
      sortType: 'desc',
    });

    this.connect(this.deleteEffect$(), applyStateOperator);
  }

  getSessions$(): Observable<Session[]> {
    const sessions$ = this.getData$();
    const tags$ = this.tags.getTags$();

    return select$(combineLatest([sessions$, tags$]), ([sessions, tags]) => {
      return sessions?.map(session => {
        return Session.fromEntity(session, tags?.filter(tag => session.tags.includes(tag.id)) ?? []);
      }) ?? [];
    });
  }

  getSession$(id: string): Observable<Nullable<Session>> {
    return select$(this.getSessions$(), sessions => sessions.find(s => s.id === id));
  }

  hasRunningSessions$(): Observable<boolean> {
    return select$(this.getSessions$(), sessions => sessions.some(isRunning));
  }

  getGroupType$(): Observable<SessionsGroupType> {
    return this.select('groupType');
  }

  getSortType$(): Observable<SortType> {
    return this.select('sortType');
  }

  addSession(session: ISession): void {
    this.addSessions([session]);
  }

  addSessions(sessions: ISession[]): void {
    this.hold(this.client.addSessions$(sessions));
  }

  updateSession(changes: Update<ISession>): void {
    this.hold(this.client.updateSessions$([changes]));
  }

  removeSessions(ids: string[]): void {
    this.hold(this.client.deleteSessions$(ids));
  }

  toggleSession(): void {
    const sessions = this.get('data')?.filter(session => !session.duration);
    if (sessions?.length) {
      const now = DateTime.local();
      const changes = sessions.map<Update<ISession>>(s =>
        ({
          id: s.id,
          changes: {
            duration: now.valueOf() - DateTime.fromISO(s.start).valueOf(),
          }
        }),
      );

      this.hold(this.client.updateSessions$(changes));
    } else {
      this.addSession(Session.fromNow(generateUUID()).toEntity());
    }
  }

  getDisplayRange(): Observable<Range<DateTime>> {
    return of({ start: DateTime.now().startOf('month'), end: DateTime.now().endOf('month') });
  }

  setDisplayRange(displayRange: Range<DateTime>): void {
    this.set({ displayRange });
  }

  changeGroupType(groupType: SessionsGroupType) {
    this.set({ groupType });
  }

  changeSortType(sortType: SortType) {
    this.set({ sortType });
  }

  toggleSessionTag(sessionId: string, tagId: string): void {
    const session = this.get('data')?.find(s => s.id === sessionId);
    if (!session) {
      return;
    }

    this.updateSession({
      id: sessionId,
      changes: {
        tags: session.tags.includes(tagId) ? session.tags.filter(id => id !== tagId) : session.tags.concat(tagId),
      }
    });
  }

  protected invalidate$(): Observable<unknown> {
    return merge(
      this.events.on$(EventType.SessionsModified),
      this.select('displayRange'),
    );
  }

  protected loadData$(): Observable<Nullable<ISession[]>> {
    const from = this.get('displayRange', 'start').toJSDate();
    const to = this.get('displayRange', 'end').toJSDate();

    return this.client.getSessions$(from, to);
  }

  private deleteEffect$(): Observable<StateOperator<SessionsState>> {
    return this.events.on$(EventType.SessionsDeleted).pipe(
      map(event => (state: SessionsState) => ({
        ...state,
        data: state.data?.filter(s => !event.data.ids.includes(s.id)),
      })),
    )
  }

}
