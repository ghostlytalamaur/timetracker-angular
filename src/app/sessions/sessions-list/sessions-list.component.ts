import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogsService } from '../../shared/alert-dialog/dialogs.service';
import { Session } from '../model/session';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsListComponent implements OnInit, OnDestroy {

  @Input()
  sessions: Session[];
  private readonly alive$: Subject<void>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService,
    private readonly dialog: DialogsService
  ) {
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

}
