import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { SessionsService } from '../sessions.service';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Session } from '../model/session';

@Component({
  selector: 'app-sessions-list',
  templateUrl: './sessions-list.component.html',
  styleUrls: ['./sessions-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsListComponent implements OnInit {

  readonly sessions$: Observable<Session[]>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly sessionsSrv: SessionsService
  ) {
    this.sessions$ = this.sessionsSrv.getSessions();
  }

  ngOnInit(): void {
  }

  trackById(index: number, item: Session): string {
    return item.id;
  }

  onOpenSession(session: Session): void {
    this.router.navigate([session.id], { relativeTo: this.route })
      .catch(console.log);
  }
}
