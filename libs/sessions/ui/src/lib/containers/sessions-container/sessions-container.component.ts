import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ISessionTag } from '@timetracker/shared';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SessionsTableService } from './sessions-table.service';
import { Session, SessionsGroupType, SessionsService, SortType } from '@tt/sessions/core';
import { SessionsTagsService } from '@tt/tags/core';
import { ClipboardContent, ClipboardService } from '@tt/core/services';
import { Nullable, Range } from '@tt/core/util';

@Component({
  selector: 'tt-sessions-container',
  templateUrl: './sessions-container.component.html',
  styleUrls: ['./sessions-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsContainerComponent {
  readonly hasRunning$: Observable<boolean>;
  readonly displayRange$: Observable<Range<Date>>;
  readonly isTodayInvisible$: Observable<boolean>;
  readonly groupType$: Observable<SessionsGroupType>;
  readonly sortType$: Observable<SortType>;
  readonly sessions$: Observable<Session[]>;
  readonly expandedNodes$: Observable<string[]>;
  readonly tags$: Observable<Nullable<ISessionTag[]>>;

  constructor(
    private readonly sessionsSrv: SessionsService,
    private readonly tagsService: SessionsTagsService,
    private readonly tableSrv: SessionsTableService,
    private readonly clipboard: ClipboardService,
  ) {
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions$();
    this.displayRange$ = this.sessionsSrv
      .getDisplayRange()
      .pipe(map((range) => ({ start: range.start.toJSDate(), end: range.end.toJSDate() })));
    this.isTodayInvisible$ = this.sessionsSrv
      .getDisplayRange()
      .pipe(map((range) => DateTime.local().diff(range.end).valueOf() > 0));
    this.groupType$ = this.sessionsSrv.getGroupType$();
    this.sortType$ = this.sessionsSrv.getSortType$();
    this.sessions$ = this.sessionsSrv.getSessions$();
    this.expandedNodes$ = this.tableSrv.getExpandedNodes();
    this.tags$ = this.tagsService.getTags$();
  }

  onToggleSession(): void {
    this.sessionsSrv.toggleSession();
  }

  onDisplayRangeChange(range: Range<Date>): void {
    this.sessionsSrv.setDisplayRange({
      start: DateTime.fromJSDate(range.start),
      end: DateTime.fromJSDate(range.end),
    });
  }

  onGroupTypeChange(groupType: SessionsGroupType): void {
    this.tableSrv.clearExpandedNodes();
    this.sessionsSrv.changeGroupType(groupType);
  }

  onSetSortType(sortType: SortType): void {
    this.sessionsSrv.changeSortType(sortType);
  }

  onDeleteSessions(sessionIds: string[]): void {
    this.sessionsSrv.removeSessions(sessionIds);
  }

  onToggleNode(nodeId: string): void {
    this.tableSrv.toggleNode(nodeId);
  }

  onCopyToClipboard(content: ClipboardContent): void {
    this.clipboard.copyToClipboard(content);
  }

  onToggleSessionTag(event: { sessionId: string; tagId: string }): void {
    this.sessionsSrv.toggleSessionTag(event.sessionId, event.tagId);
  }
}
