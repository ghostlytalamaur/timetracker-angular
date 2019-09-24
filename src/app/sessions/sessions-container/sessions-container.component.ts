import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Range } from '../../shared/utils';
import { DateTime } from 'luxon';
import { SessionsService } from '../sessions.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SessionsGroup, SessionsGroupType } from '../model/sessions-group';
import { Session } from '../model/session';

interface Sessions {
  type: 'sessions';
  sessions: Session[];
}

interface Groups {
  type: 'groups';
  groups: SessionsGroup[];
}

type SessionsOrGroups = Sessions | Groups;

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

  constructor(
    private readonly sessionsSrv: SessionsService
  ) {
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
    this.displayRange$ = this.sessionsSrv.getDisplayRange()
      .pipe(
        map(range => ({ start: range.start.toJSDate(), end: range.end.toJSDate() }))
      );
    this.groupType$ = this.sessionsSrv.getGroupType();
    this.data$ = this.groupType$
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

}
