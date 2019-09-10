import { createSession, SessionEntity } from './session-entity';
import { interval, Observable, of } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

export class Session {

  readonly duration$: Observable<number>;

  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly start: Date,
    public readonly end: Date | null
  ) {
    if (this.isRunning()) {
      this.duration$ = interval(1)
        .pipe(
          map(() => this.duration)
        );
    } else {
      this.duration$ = of(this.duration);
    }

    this.duration$ = this.duration$
      .pipe(
        publishReplay(1),
        refCount()
      );
  }

  get duration(): number {
    const end = this.end || new Date();
    return end.valueOf() - this.start.valueOf();
  }

  static fromEntity(entity: SessionEntity): Session {
    const date = new Date(entity.date);
    const start = new Date(entity.date + ' ' + entity.start);
    const end = entity.end ? new Date(entity.date + ' ' + entity.end) : null;
    return new Session(entity.id, date, start, end);
  }

  toEntity(): SessionEntity {
    return createSession(
      this.id,
      this.date.toDateString(),
      this.start.toTimeString(),
      this.end ? this.end.toTimeString() : null);
  }

  isRunning(): boolean {
    return !this.end;
  }

}
