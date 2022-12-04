import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SessionRecorderComponent } from '../session-recorder/session-recorder.component';
import { Store } from '@ngrx/store';
import { selectActiveSession, selectSessions, sessionActions } from '../sessions.store';
import { LetModule, PushModule } from '@ngrx/component';
import { SessionsTableComponent } from '../sessions-table/sessions-table.component';
import { UserButtonComponent } from '../../header/user-button/user-button.component';
import { TopBarLayoutComponent } from '../../layout/top-bar-layout/top-bar-layout.component';
import { Update } from '@ngrx/entity';
import { Session } from '../session';

@Component({
  selector: 'tt-sessions',
  templateUrl: './sessions-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SessionRecorderComponent,
    PushModule,
    SessionsTableComponent,
    LetModule,
    UserButtonComponent,
    TopBarLayoutComponent,
  ],
})
export class SessionsPageComponent {
  private readonly store = inject(Store);

  protected readonly sessions$ = this.store.select(selectSessions);
  protected readonly activeSession$ = this.store.select(selectActiveSession);

  protected onStartSession(params: { start: Date }): void {
    this.store.dispatch(sessionActions.startSession(params));
  }

  protected onSessionChange(changes: Update<Session>): void {
    this.store.dispatch(sessionActions.changeSession({ changes }));
  }

  protected onDeleteSession(id: string): void {
    this.store.dispatch(sessionActions.deleteSession({ id }));
  }
}
