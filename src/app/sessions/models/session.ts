import { DateTime, Duration } from 'luxon';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { SessionEntity, createSession } from './session-entity';
import { SessionsGroupType } from './sessions-group';

export class Session {
  public constructor(
    public readonly id: string,
    public readonly start: DateTime,
    public readonly duration: Duration | null,
  ) {
  }

  public static fromEntity(entity: SessionEntity): Session {
    return new Session(entity.id,
      DateTime.fromMillis(entity.start),
      entity.duration ? Duration.fromMillis(entity.duration) : null,
    );
  }

  public static fromNow(id: string): Session {
    const date = DateTime.local();
    return new Session(id, date, null);
  }

  public toEntity(): SessionEntity {
    return createSession(
      this.id,
      this.start.valueOf(),
      this.duration ? this.duration.valueOf() : null);
  }

}

export function isRunning(session: Session): boolean {
  return !session.duration;
}

export function getDuration(start: DateTime, duration: Duration | null, rate: number): Observable<Duration>;
export function getDuration(start: DateTime | null, duration: Duration | null, rate: number):
  Observable<Duration | null> {

  if (!start) {
    return of(null);
  } else if (start && !duration) {
    return timer(0, rate)
      .pipe(
        map(() => DateTime.local().diff(start)),
      );
  } else {
    return of(duration);
  }
}

export function getGroupDuration(sessions: Session[]): Observable<Duration> {
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
    return timer(0, environment.settings.durationRate)
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

export function getGroupId(session: Session, groupType: SessionsGroupType): string {
  switch (groupType) {
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
}
