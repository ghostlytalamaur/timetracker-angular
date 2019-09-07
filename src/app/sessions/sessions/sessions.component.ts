import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SessionsService } from '../sessions.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent implements OnInit {

  hasRunning$: Observable<boolean>;

  constructor(
    private sessionsSrv: SessionsService
  ) {
    this.hasRunning$ = this.sessionsSrv.hasRunningSessions();
  }

  ngOnInit() {
    this.sessionsSrv.loadSessions();
  }

  onToggleSession(): void {
    this.sessionsSrv.toggleSession();
  }
}
