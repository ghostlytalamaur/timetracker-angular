import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateTime } from 'luxon';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { DialogsService } from '../../shared/alert-dialog/dialogs.service';
import { Range } from '../../shared/types';
import { Session } from '../model/session';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsListComponent implements OnInit, OnDestroy {

  readonly sessions$: Observable<Session[]>;
  private readonly alive$: Subject<void>;
  readonly hasRunning$: Observable<boolean>;
  readonly displayRange$: Observable<Range<Date>>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService,
    private readonly dialog: DialogsService
  ) {
    this.sessions$ = this.sessionsSrv.getSessions();
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
    this.displayRange$ = this.sessionsSrv.getDisplayRange()
      .pipe(
        map(range => ({ start: range.start.toJSDate(), end: range.end.toJSDate() }))
      );
    this.alive$ = new Subject<void>();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.alive$.next();
    this.alive$.complete();
  }

  trackById(index: number, item: Session): string {
    return item.id;
  }

  onOpenSession(session: Session): void {
    this.router.navigate([session.id], { relativeTo: this.route })
      .catch(console.log);
  }

  onDeleteSession(session: Session) {
    this.dialog.confirmation({
      message: 'Remove session?'
    })
      .pipe(
        takeUntil(this.alive$)
      )
      .subscribe(
        () => this.sessionsSrv.removeSession(session.id),
        () => {
        }
      );
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

}
