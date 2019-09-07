import { createSession, SessionEntity } from './session-entity';

export class Session {

  readonly start: Date;
  readonly end: Date | undefined;
  readonly id: string;

  constructor(
    id: string,
    start: string,
    end: string | undefined
  ) {
    this.id = id;
    this.start = new Date(start);
    if (end) {
      this.end = new Date(end);
    }
  }

  get elapsed(): number {
    const end = this.end || new Date();
    return end.valueOf() - this.start.valueOf();
  }

  static fromEntity(entity: SessionEntity): Session {
    return new Session(entity.id, entity.start, entity.end);
  }

  toEntity(): SessionEntity {
    return createSession(this.id, this.start.toString(), this.end && this.end.toString());
  }

  isRunning(): boolean {
    return !this.end;
  }

}
