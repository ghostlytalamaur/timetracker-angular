export interface Session {
  readonly id: string;
  readonly start: Date;
  readonly durationMs: number;
  readonly description: string;
  readonly tags: string[];
}

export interface SessionsGroup {
  readonly id: string;
  readonly date: Date;
  readonly sessions: Session[];
}

export function isActive(session: Session): boolean {
  return session.durationMs < 0;
}

export function getDuration(session: Session): number {
  return isActive(session) ? Date.now() - session.start.valueOf() : session.durationMs;
}
