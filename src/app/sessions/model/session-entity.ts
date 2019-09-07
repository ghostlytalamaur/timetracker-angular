export interface SessionEntity {
  readonly id: string;
  readonly start: string;
  readonly end: string | null;
}

export function createSession(id: string, start: string, end: string | null): SessionEntity {
  return { id, start, end };
}
