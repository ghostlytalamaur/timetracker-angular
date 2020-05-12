import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireFunctions } from '@angular/fire/functions';
import { SessionsService, SessionsTagsService } from '@app/store';

@Component({
  selector: 'app-data-container',
  templateUrl: './app-data-container.component.html',
  styleUrls: ['./app-data-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppDataContainerComponent implements OnInit, OnDestroy {

  public constructor(
    private readonly sessionsService: SessionsService,
    private readonly tagsService: SessionsTagsService,
    private readonly afunc: AngularFireFunctions,
  ) {
    afunc.httpsCallable('testCallable')({ param1: 'value1', obj2: { prop2: 'value2' }})
      .subscribe({
        next: res => console.log('functions response', res),
        error: err => console.log(err),
        complete: () => console.log('function completed'),
      });
  }

  public ngOnInit(): void {
    this.tagsService.requestTags();
    this.sessionsService.requestSessions();
  }

  public ngOnDestroy(): void {
    this.tagsService.cancelRequestTags();
    this.sessionsService.cancelRequestSessions();
  }

}
