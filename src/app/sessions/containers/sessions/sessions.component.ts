import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { routerAnimation } from '@app/shared/animations';
import { Status } from '@app/shared/types';
import { SessionsService } from '@app/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class SessionsComponent implements OnInit {

  public readonly status$: Observable<Status>;

  public constructor(
    private sessionsSrv: SessionsService,
  ) {
    this.status$ = this.sessionsSrv.getStatus();
  }

  public ngOnInit() {
  }

}
