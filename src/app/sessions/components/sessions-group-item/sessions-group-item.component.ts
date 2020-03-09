import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
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
export class SessionsGroupItemComponent implements OnInit, OnChanges {
  public readonly dateFormat: Record<SessionsGroupType, string> = {
    none: environment.settings.dateFormat,
    day: 'MMMM d, y',
    week: 'MMMM d, y',
    month: 'MMMM, y',
    year: 'y',
  };

  @Input() public group: SessionsGroup | undefined;

  public duration$: Observable<Duration> | undefined;

  public ngOnInit() {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.group) {
      this.updateDuration();
    }
  }

  private updateDuration(): void {
    if (!this.group) {
      this.duration$ = undefined;
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
      this.duration$ = of(closedDuration);
    } else {
      this.duration$ = timer(0, environment.settings.durationRate)
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
