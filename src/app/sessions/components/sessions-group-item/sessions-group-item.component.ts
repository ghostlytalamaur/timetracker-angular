import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { DateTime, Duration } from 'luxon';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { Session, SessionsGroup, SessionsGroupType } from '../../models';

@Component({
  selector: 'app-sessions-group-item',
  templateUrl: './sessions-group-item.component.html',
  styleUrls: ['./sessions-group-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionsGroupItemComponent implements OnInit {
  readonly dateFormat: Record<SessionsGroupType, string> = {
    none: environment.settings.dateFormat,
    day: 'MMMM d, y',
    week: 'MMMM d, y',
    month: 'MMMM, y',
    year: 'y',
  };
  private mGroup: SessionsGroup | undefined;
  private mDuration: Observable<Duration> | undefined;

  constructor() {
  }

  get group(): SessionsGroup | undefined {
    return this.mGroup;
  }

  @Input()
  set group(value: SessionsGroup | undefined) {
    this.mGroup = value;
    this.updateDuration();
  }

  get duration$(): Observable<Duration> | undefined {
    return this.mDuration;
  }

  ngOnInit() {
  }

  getListSize(): number {
    return Math.min(5, this.group ? this.group.sessions.length : 0) * 74;
  }

  private updateDuration(): void {
    if (!this.group) {
      this.mDuration = undefined;
      return;
    }

    const runningSessions: Session[] = [];
    let closedDuration: Duration = Duration.fromMillis(0);
    for (const session of this.group.sessions) {
      if (!session.duration) {
        runningSessions.push(session);
      } else {
        closedDuration = closedDuration.plus(session.duration);
      }
    }

    if (!runningSessions.length) {
      this.mDuration = of(closedDuration);
    } else {
      this.mDuration = timer(0, environment.settings.durationRate)
        .pipe(
          map(() => {
            const now = DateTime.local();
            const sumDuration = runningSessions.reduce((acc, session) =>
              acc.plus(now.diff(session.start)), Duration.fromMillis(0),
            );
            return closedDuration.plus(sumDuration);
          }),
        );
    }
  }
}
