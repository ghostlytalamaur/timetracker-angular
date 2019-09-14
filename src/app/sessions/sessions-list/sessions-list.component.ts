import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SessionsService } from '../sessions.service';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../model/session';
import { DialogsService } from '../../shared/alert-dialog/dialogs.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsListComponent implements OnInit, OnDestroy {

  readonly sessions$: Observable<Session[]>;
  private readonly alive$: Subject<void>;
  private readonly hasRunning$: Observable<boolean>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService,
    private readonly dialog: DialogsService
  ) {
    this.sessions$ = this.sessionsSrv.getSessions();
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
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
}
