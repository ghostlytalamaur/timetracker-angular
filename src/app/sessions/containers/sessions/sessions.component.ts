import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { routerAnimation } from '@app/shared/animations';
import { DialogsService } from '@app/shared/dialogs';
import { SessionsService } from '@app/store';
import { Observable, Subscription } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [routerAnimation],
})
export class SessionsComponent implements OnInit, OnDestroy {

  public readonly isLoading$: Observable<boolean>;
  public readonly error$: Observable<string>;
  public subscription: Subscription;

  public constructor(
    private sessionsSrv: SessionsService,
    private dialogs: DialogsService,
  ) {
    this.isLoading$ = this.sessionsSrv.isLoading();
    this.error$ = this.sessionsSrv.getError();
  }

  public ngOnInit() {
    this.sessionsSrv.loadSessions();
    this.subscription = this.error$
      .pipe(
        filter(message => !!message),
        switchMap(message => this.dialogs.showAlert({ title: 'Error', message })),
      )
      .subscribe(() => this.sessionsSrv.clearError());
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
