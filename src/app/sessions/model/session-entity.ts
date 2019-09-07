export interface SessionEntity {
  readonly id: string;
  readonly date: string;
  readonly start: string;
  readonly end: string | null;
}

export function createSession(id: string, date: string, start: string, end: string | null): SessionEntity {
  return { id, date, start, end };
}
