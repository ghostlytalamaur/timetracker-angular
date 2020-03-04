import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { SessionsService } from '../../services/sessions.service';
import { filter, switchMap } from 'rxjs/operators';
import { DialogsService } from '../../../shared/alert-dialog/dialogs.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SessionsComponent implements OnInit, OnDestroy {

  readonly isLoading$: Observable<boolean>;
  readonly error$: Observable<string>;
  subscription: Subscription;

  constructor(
    private sessionsSrv: SessionsService,
    private dialogs: DialogsService
  ) {
    this.isLoading$ = this.sessionsSrv.isLoading();
    this.error$ = this.sessionsSrv.getError();
  }

  ngOnInit() {
    this.sessionsSrv.loadSessions();
    this.subscription = this.error$
      .pipe(
        filter(message => !!message),
        switchMap(message => this.dialogs.showAlert({ title: 'Error', message }))
      )
      .subscribe(() => this.sessionsSrv.clearError());
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
