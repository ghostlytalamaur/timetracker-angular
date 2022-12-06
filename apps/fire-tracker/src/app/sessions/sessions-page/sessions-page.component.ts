import { ChangeDetectionStrategy, Component, inject, OnInit, TrackByFunction } from "@angular/core";
import { SessionRecorderComponent } from '../session-recorder/session-recorder.component';
import { createSelector, Store } from '@ngrx/store';
import {
  selectActiveSession,
  selectSessionsGroups,
  sessionActions,
  sessionsFeature,
} from '../sessions.store';
import { LetModule, PushModule } from '@ngrx/component';
import { SessionsTableComponent } from '../sessions-table/sessions-table.component';
import { UserButtonComponent } from '../../header/user-button/user-button.component';
import { TopBarLayoutComponent } from '../../layout/top-bar-layout/top-bar-layout.component';
import { Update } from '@ngrx/entity';
import { Session, SessionsGroup } from '../session';
import { DateRangePickerComponent } from '../date-range-picker/date-range-picker.component';
import { sessionsViewActions, sessionsViewFeature } from '../sessions-view.store';
import { DateRange } from '../../models/date-range';
import { LoaderDirective } from '../../ui/loader.directive';
import { SessionsGroupComponent } from "../sessions-group/sessions-group.component";
import { NgForOf } from "@angular/common";

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
    DateRangePickerComponent,
    LoaderDirective,
    SessionsGroupComponent,
    NgForOf,
  ],
})
export class SessionsPageComponent implements OnInit {
  private readonly store = inject(Store);

  protected readonly vm$ = this.store.select(
    createSelector(
      selectSessionsGroups,
      selectActiveSession,
      sessionsViewFeature.selectRange,
      sessionsFeature.selectStatus,
      (groups, activeSession, range, status) => ({
        groups,
        activeSession,
        range,
        status,
      }),
    ),
  );

  protected readonly trackById: TrackByFunction<SessionsGroup> = (index, item) => item.id;

  public ngOnInit(): void {
    this.store.dispatch(sessionActions.loadSessions());
  }

  protected onStartSession(params: { start: Date }): void {
    this.store.dispatch(sessionActions.startSession(params));
  }

  protected onSessionChange(changes: Update<Session>): void {
    this.store.dispatch(sessionActions.changeSession({ changes }));
  }

  protected onDeleteSession(id: string): void {
    this.store.dispatch(sessionActions.deleteSession({ id }));
  }

  protected onRangeChange(range: DateRange): void {
    this.store.dispatch(sessionsViewActions.changeRange({ range }));
  }
}
