import { ISession, createSession, ISessionTag } from '@timetracker/shared';
import { DateTime, Duration } from 'luxon';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { SessionsGroupType } from './sessions-group';



export class Session {
  constructor(
    readonly id: string,
    readonly start: DateTime,
    readonly duration: Duration | null,
    readonly tags: ISessionTag[],
  ) {
  }

  static fromEntity(entity: ISession, tags: ISessionTag[]): Session {
    return new Session(entity.id,
      DateTime.fromISO(entity.start),
      entity.duration ? Duration.fromMillis(entity.duration) : null,
      tags,
    );
  }

  static fromNow(id: string): Session {
    const date = DateTime.local();
    return new Session(id, date, null, []);
  }

  hasTag(tagId: string): boolean {
    return this.tags.some(tag => tag.id === tagId);
  }

  toEntity(): ISession {
    return createSession(
      this.id,
      this.start.toJSDate().toISOString(),
      this.duration ? this.duration.valueOf() : null,
      this.tags.map(tag => tag.id),
      );
  }

  calculateDuration(): Duration {
    return this.duration ?? DateTime.local().diff(this.start);
  }

}

export function isRunning(session: Session): boolean {
  return !session.duration;
}

export function getDuration$(ticks$: Observable<number>, calculate: () => Duration | null): Observable<Duration | null> {
  return ticks$.pipe(
    map(calculate),
    distinctUntilChanged((a, b) => a?.valueOf() === b?.valueOf()),
  );
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
