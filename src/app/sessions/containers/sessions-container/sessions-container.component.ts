import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Session, SessionsGroupType, SessionsService, SortType } from '@app/store';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Range } from '../../../shared/utils';

import { SessionsTableService } from './sessions-table.service';

@Component({
  selector: 'app-sessions-container',
  templateUrl: './sessions-container.component.html',
  styleUrls: ['./sessions-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsContainerComponent implements OnInit {

  public readonly hasRunning$: Observable<boolean>;
  public readonly displayRange$: Observable<Range<Date>>;
  public readonly isTodayInvisible$: Observable<boolean>;
  public readonly groupType$: Observable<SessionsGroupType>;
  public readonly sortType$: Observable<SortType>;
  public readonly sessions$: Observable<Session[]>;
  public readonly expandedNodes$: Observable<string[]>;

  public constructor(
    private readonly sessionsSrv: SessionsService,
    private readonly tableSrv: SessionsTableService,
  ) {
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
    this.displayRange$ = this.sessionsSrv.getDisplayRange()
      .pipe(
        map(range => ({ start: range.start.toJSDate(), end: range.end.toJSDate() })),
      );
    this.isTodayInvisible$ = this.sessionsSrv.getDisplayRange()
      .pipe(
        map(range => DateTime.local().diff(range.end).valueOf() > 0),
      );
    this.groupType$ = this.sessionsSrv.getGroupType();
    this.sortType$ = this.sessionsSrv.getSortType();
    this.sessions$ = this.sessionsSrv.getSessions();
    this.expandedNodes$ = this.tableSrv.getExpandedNodes();
  }

  public ngOnInit() {
  }


  public onToggleSession(): void {
    this.sessionsSrv.toggleSession();
  }

  public onDisplayRangeChange(range: Range<Date>): void {
    this.sessionsSrv.setDisplayRange({
      start: DateTime.fromJSDate(range.start),
      end: DateTime.fromJSDate(range.end),
    });
  }

  public onGroupTypeChange(groupType: SessionsGroupType): void {
    this.tableSrv.clearExpandedNodes();
    this.sessionsSrv.changeGroupType(groupType);
  }

  public onSetSortType(sortType: SortType): void {
    this.sessionsSrv.changeSortType(sortType);
  }

  public onDeleteSessions(sessionIds: string[]): void {
    this.sessionsSrv.removeSessions(sessionIds);
  }

  public onToggleNode(nodeId: string): void {
    this.tableSrv.toggleNode(nodeId);
  }
}
