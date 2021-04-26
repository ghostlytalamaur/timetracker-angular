import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IStatus } from '@app/core/store';
import { SessionsService } from '@app/sessions/core';
import { SessionsTagsService } from '@app/tags/core';

@Component({
  selector: 'tt-sessions',
  templateUrl: './sessions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsComponent implements OnInit, OnDestroy {
  readonly status$: Observable<IStatus>;

  constructor(
    private readonly sessionsSrv: SessionsService,
    private readonly tags: SessionsTagsService,
  ) {
    this.status$ = this.sessionsSrv.getStatus$();
  }

  ngOnInit(): void {
    this.sessionsSrv.request();
    this.tags.request();
  }

  ngOnDestroy(): void {
    this.sessionsSrv.cancelRequest();
    this.tags.cancelRequest();
  }
}
