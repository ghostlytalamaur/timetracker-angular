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

export interface ImportDataDto {
  readonly sessions: {
    id: string;
    start: string; // ISO Date "2021-04-02T08:10:12.312+03:00"
    duration: number; //ISO Duration "PT35122.878S",
    tags: string[]; // tags ids
  }[];
  readonly tags: {
    id: string;
    label: string;
    sessions: string[]; // sessions ids
  }[];
}

export function createSession(
  id: string,
  start: string,
  duration: number | null,
  tags: string[],
): ISession {
  return { id, start, duration, tags };
}
