import { Session } from './session';
import { DateTime } from 'luxon';

export type SessionsGroupType = 'none' | 'day' | 'week' | 'month' | 'year';

export interface SessionsGroup {
  readonly id: string;
  readonly type: SessionsGroupType;
  readonly date: DateTime;
  readonly sessions: ReadonlyArray<Session>;
}

export function createGroup(id: string, type: SessionsGroupType, date: DateTime, sessions: Session[]): SessionsGroup {
  return { id, type, date, sessions };
}
