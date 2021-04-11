import { DateTime, Duration } from 'luxon';

import { Session } from './session';

export type SessionsGroupType = 'none' | 'day' | 'week' | 'month' | 'year';

interface GroupMetrics {
  readonly from: DateTime;
  readonly to: DateTime;
  readonly total: Duration;
  readonly pause: Duration;
}

export class SessionsGroup {
  constructor(
    readonly id: string,
    readonly type: SessionsGroupType,
    readonly date: DateTime,
    readonly sessions: Session[],
  ) {}

  toClipboardString(): string {
    const metrics = this.calculateMetric();

    if (metrics) {
      return `${metrics.from.toFormat('HH:mm')}\t${metrics.to.toFormat(
        'HH:mm',
      )}\t${metrics.pause.toFormat('hh:mm')}`;
    } else {
      return '';
    }
  }

  calculateDuration(): Duration {
    return this.calculateMetric()?.total ?? Duration.fromMillis(0);
  }

  private calculateMetric(): GroupMetrics | null {
    if (this.sessions.length === 0) {
      return null;
    }

    const now = DateTime.local();
    const sessions = this.sessions
      .map((session) => ({
        start: session.start,
        end: session.duration ? session.start.plus(session.duration) : now,
      }))
      .sort((a, b) => a.start.valueOf() - b.start.valueOf());
    for (let len = sessions.length, i = len - 1; i > 0; i--) {
      const s1 = sessions[i];
      const s2 = sessions[i - 1];
      if (s1.start.valueOf() < s2.end.valueOf()) {
        // overlap
        s2.end = s1.end.valueOf() > s2.end.valueOf() ? s1.end : s2.end;
        sessions.splice(i, 1);
      }
    }
    let total = Duration.fromMillis(0);
    for (const session of sessions) {
      total = total.plus(session.end.diff(session.start));
    }
    let pause = Duration.fromMillis(0);
    for (let len = sessions.length, i = 0; i < len - 1; i++) {
      pause = pause.plus(sessions[i + 1].start.diff(sessions[i].end));
    }

    const from = sessions[0].start;
    const to = sessions[sessions.length - 1].end;

    return { from, to, total, pause };
  }
}

export function createGroup(
  id: string,
  type: SessionsGroupType,
  date: DateTime,
  sessions: Session[],
): SessionsGroup {
  return new SessionsGroup(id, type, date, sessions);
}
