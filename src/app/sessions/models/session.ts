import { DateTime, Duration } from 'luxon';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

import { createSession, SessionEntity } from './session-entity';

export class Session {
  constructor(
    public readonly id: string,
    public readonly start: DateTime,
    public readonly duration: Duration | null,
  ) {
  }

  static fromEntity(entity: SessionEntity): Session {
    return new Session(entity.id,
      DateTime.fromMillis(entity.start),
      entity.duration ? Duration.fromMillis(entity.duration) : null,
    );
  }

  static fromNow(id: string): Session {
    const date = DateTime.local();
    return new Session(id, date, null);
  }

  toEntity(): SessionEntity {
    return createSession(
      this.id,
      this.start.valueOf(),
      this.duration ? this.duration.valueOf() : null);
  }

}

export function isRunning(session: Session): boolean {
  return !session.duration;
}

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
