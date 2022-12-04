export interface Session {
  readonly id: string;
  readonly start: Date;
  readonly durationMs: number;
  readonly description: string;
}

export function isActive(session: Session): boolean {
  return session.durationMs < 0;
}
