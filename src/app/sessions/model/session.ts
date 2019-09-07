import { createSession, SessionEntity } from './session-entity';

export class Session {

  constructor(
    public readonly id: string,
    public readonly date: Date,
    public readonly start: Date,
    public readonly end: Date | null
  ) {
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
