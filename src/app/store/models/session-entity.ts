export interface SessionEntity {
  readonly id: string;
  // Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
  readonly start: number;
  readonly duration: number | null;
}

export function createSession(id: string, start: number, duration: number | null): SessionEntity {
  return { id, start, duration };
}
