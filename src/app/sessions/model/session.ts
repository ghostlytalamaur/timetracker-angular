import { createSession, SessionEntity } from './session-entity';
import { Observable, of, timer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';

export class Session {
  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly start: Date,
    public readonly end: Date | null
  ) {
  }

  static fromEntity(entity: SessionEntity): Session {
    const date = new Date(entity.date);
    const start = new Date(entity.date + ' ' + entity.start);
    const end = entity.end ? new Date(entity.date + ' ' + entity.end) : null;
    return new Session(entity.id, date, start, end);
  }

  static fromNow(id: string): Session {
    const date = new Date();
    return new Session(id, date, date, null);
  }

  toEntity(): SessionEntity {
    return createSession(
      this.id,
      this.date.toDateString(),
      this.start.toTimeString(),
      this.end ? this.end.toTimeString() : null);
  }

}

export function isRunning(session: Session): boolean {
  return !session.end;
}

function withSameDate(date: Date, base: Date): Date {
  const newDate = new Date(date);
  newDate.setFullYear(base.getFullYear(), base.getMonth(), base.getDate());
  return newDate;
}

export function calculateDuration(start: Date, end: Date | undefined | null): number {
  return +withSameDate(end || new Date(), start) - +start;
}

export function getDuration(start: Date | null | undefined, end: Date | null | undefined, rate: number): Observable<number | undefined> {
  if (!start) {
    return of(undefined);
  } else if (start && !end) {
    return timer(0, environment.settings.durationRate)
      .pipe(
        map(() => calculateDuration(start, end))
      );
  } else {
    return of(calculateDuration(start, end));
  }
}
