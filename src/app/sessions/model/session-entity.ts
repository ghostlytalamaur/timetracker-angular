export interface SessionEntity {
  readonly id: string;
  readonly start: number;
  readonly duration: number | null;
}

export function createSession(id: string, start: number, duration: number | null): SessionEntity {
  return { id, start, duration };
}
