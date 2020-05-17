import { DateTime, Duration } from 'luxon';
import { Observable, ReplaySubject, of, timer } from 'rxjs';
import { map, multicast, refCount } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

import { SessionEntity, createSession } from './session-entity';
import { SessionTag } from './session-tag';
import { SessionsGroupType } from './sessions-group';

export class Session {
  public constructor(
    public readonly id: string,
    public readonly start: DateTime,
    public readonly duration: Duration | null,
    public readonly tags: SessionTag[],
  ) {
  }

  public static fromEntity(entity: SessionEntity, tags: SessionTag[]): Session {
    return new Session(entity.id,
      DateTime.fromMillis(entity.start),
      entity.duration ? Duration.fromMillis(entity.duration) : null,
      tags,
    );
  }

  public static fromNow(id: string): Session {
    const date = DateTime.local();
    return new Session(id, date, null, []);
  }

  public hasTag(tagId: string): boolean {
    return this.tags.some(tag => tag.id === tagId);
  }

  public toEntity(): SessionEntity {
    return createSession(
      this.id,
      this.start.valueOf(),
      this.duration ? this.duration.valueOf() : null,
      this.tags.map(tag => tag.id),
    );
  }

}

export function isRunning(session: Session): boolean {
  return !session.duration;
}

const ticks$ = timer(0, environment.settings.durationRate)
  .pipe(
    multicast(() => new ReplaySubject(1)),
    refCount(),
  );

export function getDuration(start: DateTime, duration: Duration | null): Observable<Duration>;
export function getDuration(start: DateTime | null, duration: Duration | null):
  Observable<Duration | null> {

  if (!start) {
    return of(null);
  } else if (start && !duration) {
    return ticks$
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
    return ticks$
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
