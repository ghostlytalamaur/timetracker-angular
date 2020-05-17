export interface SessionEntity {
  readonly id: string;
  // Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
  readonly start: number;
  readonly duration: number | null;
  readonly tags: string[];
}

export function createSession(id: string, start: number, duration: number | null, tags: string[]): SessionEntity {
  return { id, start, duration, tags };
}
