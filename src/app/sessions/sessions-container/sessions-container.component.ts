import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Range } from '../../shared/utils';
import { DateTime } from 'luxon';
import { SessionsService } from '../sessions.service';
import { map, switchMap } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { SessionsGroup, SessionsGroupType } from '../model/sessions-group';
import { Session } from '../model/session';
import { SortType } from '../store/settings';
import { contramap, fromCompare, getDualOrd } from 'fp-ts/es6/Ord';

interface Sessions {
  type: 'sessions';
  sessions: Session[];
}

interface Groups {
  type: 'groups';
  groups: SessionsGroup[];
}

const ordDateTime = fromCompare<DateTime>((d1, d2) => d1 < d2 ? -1 : d1 > d2 ? 1 : 0);
const ordGroups = contramap<DateTime, SessionsGroup>(g => g.date)(ordDateTime);
const ordSessions = contramap<DateTime, Session>(s => s.start)(ordDateTime);

type SessionsOrGroups = Sessions | Groups;

function sortData(data: SessionsOrGroups, direction: SortType): SessionsOrGroups {
  if (data.type === 'groups') {
    return {
      type: 'groups',
      groups: data.groups.slice().sort(direction === 'asc' ? ordGroups.compare : getDualOrd(ordGroups).compare)
    };
  } else {
    return {
      type: 'sessions',
      sessions: data.sessions.slice().sort(direction === 'asc' ? ordSessions.compare : getDualOrd(ordSessions).compare)
    };
  }
}

@Component({
  selector: 'app-sessions-container',
  templateUrl: './sessions-container.component.html',
  styleUrls: ['./sessions-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsContainerComponent implements OnInit {

  readonly hasRunning$: Observable<boolean>;
  readonly displayRange$: Observable<Range<Date>>;
  readonly data$: Observable<SessionsOrGroups>;
  readonly groupType$: Observable<SessionsGroupType>;
  readonly sortType$: Observable<SortType>;

  constructor(
    private readonly sessionsSrv: SessionsService
  ) {
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
    this.displayRange$ = this.sessionsSrv.getDisplayRange()
      .pipe(
        map(range => ({ start: range.start.toJSDate(), end: range.end.toJSDate() }))
      );
    this.groupType$ = this.sessionsSrv.getGroupType();
    this.sortType$ = this.sessionsSrv.getSortType();
    const data$ = this.groupType$
      .pipe(
        switchMap(groupType => {
          if (groupType === 'none') {
            return this.sessionsSrv.getSessions()
              .pipe(
                map((sessions: Session[]): Sessions => ({
                  type: 'sessions',
                  sessions
                }))
              );
          } else {
            return this.sessionsSrv.getSessionGroups()
              .pipe(
                map((groups: SessionsGroup[]): Groups => ({
                  type: 'groups',
                  groups
                }))
              );
          }
        })
      );
    this.data$ = combineLatest(data$, this.sortType$)
      .pipe(
        map(([data, sortType]) => sortData(data, sortType))
      );
  }

  ngOnInit() {
  }


  onToggleSession(): void {
    this.sessionsSrv.toggleSession();
  }

  onDisplayRangeChange(range: Range<Date>): void {
    this.sessionsSrv.setDisplayRange({
      start: DateTime.fromJSDate(range.start),
      end: DateTime.fromJSDate(range.end)
    });
  }

  onGroupTypeChange(groupType: SessionsGroupType): void {
    this.sessionsSrv.changeGroupType(groupType);
  }

  isSessions(data: SessionsOrGroups): data is Sessions {
    return data.type === 'sessions';
  }

  isGroups(data: SessionsOrGroups): data is Groups {
    return data.type === 'groups';
  }

  onSetSortType(sortType: SortType): void {
    this.sessionsSrv.changeSortType(sortType);
  }
}
