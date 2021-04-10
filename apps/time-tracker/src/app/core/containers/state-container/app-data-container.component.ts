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
    this.tagsService.request();
    this.sessionsService.request();
  }

  ngOnDestroy(): void {
    this.tagsService.cancelRequest();
    this.sessionsService.cancelRequest();
  }

}
