export interface ISession {
  readonly id: string;
  readonly start: string;
  readonly duration: number | null;
  readonly tags: string[];
}

export interface ISessionTag {
  readonly id: string;
  readonly label: string;
}

export class CreateSessionDto {
  start!: string;
  duration!: number | null;
  tags?: string[];
}

export class CreateSessionTagDto {
  label!: string;
}

export function createSession(id: string, start: string, duration: number | null, tags: string[]): ISession {
  return { id, start, duration, tags };
}
