import { DateTime, Duration } from 'luxon';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../../environments/environment';
import { clustering } from '../../../shared/utils';
import { Session, SessionsGroupType, getDuration } from '../../models';

export interface GroupRow {
  type: 'group';
  id: string;
  date: DateTime;
  text: string;
  duration$: Observable<Duration>;
}

export interface SessionRow {
  type: 'session';
  id: string;
  start: DateTime;
  end: DateTime | null;
  duration$: Observable<Duration>;
}

export type TableRow = GroupRow | SessionRow;


export class SessionTableModelBuilder {
  public constructor(
    private readonly groupType: SessionsGroupType,
    private readonly sessions: Session[],
  ) {
  }

  public build(): TableRow[] {
    if (this.groupType !== 'none') {
      return this.buildGroupedRows();
    } else {
      return this.getSessionRows(this.sessions);
    }
  }

  private buildGroupedRows(): TableRow[] {
    const rows: TableRow[] = [];
    const getSessionId: (session: Session) => string = session => {
      switch (this.groupType) {
        case 'none':
          return session.id;
        case 'day':
          return `${session.start.year}-${session.start.month}-${session.start.day}`;
        case 'week':
          return `${session.start.year}-${session.start.weekNumber}`;
        case 'month':
          return `${session.start.year}-${session.start.month}`;
        case 'year':
          return `${session.start.year}`;
      }
    };

    const getGroupText = (date: DateTime): string => {
      const dateFormat: Record<SessionsGroupType, string> = {
        none: environment.settings.dateFormat,
        day: 'MMMM d, y',
        week: 'MMMM d, y',
        month: 'MMMM, y',
        year: 'y',
      };

      if (this.groupType === 'week') {
        return `${date.startOf('week').toFormat(dateFormat[this.groupType])} - ${date.endOf('week').toFormat(dateFormat[this.groupType])}`;
      } else {
        return date.toFormat(dateFormat[this.groupType]);
      }
    };

    const clusters = clustering(this.sessions, getSessionId);
    for (const cluster of clusters) {
      const date = cluster.reduce((min, session) => session.start < min ? session.start : min, cluster[0].start);
      rows.push({
        type: 'group',
        id: date.toString(),
        date,
        text: getGroupText(date),
        duration$: this.getGroupDuration(cluster),
      });
      rows.push(...this.getSessionRows(cluster));
    }

    return rows;
  }

  private getGroupDuration(sessions: Session[]): Observable<Duration> {
    const runningSessions: Session[] = [];
    let closedDuration: Duration = Duration.fromMillis(0);
    for (const session of sessions) {
      if (!session.duration) {
        runningSessions.push(session);
      } else {
        closedDuration = closedDuration.plus(session.duration);
      }
    }

    if (!runningSessions.length) {
      return of(closedDuration);
    } else {
      return  timer(0, environment.settings.durationRate)
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
  private getSessionRows(sessions: Session[]): SessionRow[] {
    return sessions.map(session => {
      const duration$ = getDuration(session.start, session.duration, environment.settings.durationRate);

      return {
        type: 'session',
        id: session.id,
        start: session.start,
        end: session.duration ? session.start.plus(session.duration) : null,
        duration$,
      }
    });
  }

}
