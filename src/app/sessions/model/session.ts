export interface Session {
  readonly id: string;
  readonly start: string;
  readonly end: string | undefined;
}

export function createSession(id: string, start: string, end: string | undefined): Session {
  return { id, start, end };
}
