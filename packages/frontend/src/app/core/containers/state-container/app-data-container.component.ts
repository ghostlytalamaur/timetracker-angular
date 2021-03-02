import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SessionsService, SessionsTagsService } from '@app/store';

@Component({
  selector: 'app-data-container',
  templateUrl: './app-data-container.component.html',
  styleUrls: ['./app-data-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataContainerComponent implements OnInit, OnDestroy {

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly tagsService: SessionsTagsService,
  ) {
  }

  ngOnInit(): void {
    this.tagsService.requestTags();
    this.sessionsService.requestSessions();
  }

  ngOnDestroy(): void {
    this.tagsService.cancelRequestTags();
    this.sessionsService.cancelRequestSessions();
  }

}
