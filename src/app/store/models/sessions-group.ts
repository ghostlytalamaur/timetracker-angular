import { DateTime } from 'luxon';

import { Session } from './session';

export type SessionsGroupType = 'none' | 'day' | 'week' | 'month' | 'year';

export class SessionsGroup {
  constructor(
    readonly id: string,
    readonly type: SessionsGroupType,
    readonly date: DateTime,
    readonly sessions: Session[],
  ) {
  }
}

export function createGroup(id: string, type: SessionsGroupType, date: DateTime, sessions: Session[]): SessionsGroup {
  return new SessionsGroup(id, type, date, sessions);
}
