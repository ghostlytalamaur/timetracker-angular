import { ChangeDetectionStrategy, Component } from '@angular/core';
import { routerAnimation } from '@app/shared/animations';
import { IStatus } from '@app/shared/utils';
import { SessionsService } from '@app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class SessionsComponent {
  readonly status$: Observable<IStatus>;

  constructor(private sessionsSrv: SessionsService) {
    this.status$ = this.sessionsSrv.getStatus$();
  }
}
