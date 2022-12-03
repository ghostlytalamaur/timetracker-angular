import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  TrackByFunction,
} from '@angular/core';
import { Session } from '../sessions.store';
import { CommonModule } from '@angular/common';
import { formatDuration, parseDuration } from '../../utils/duration';
import { Update } from '@ngrx/entity';
import { FormsModule } from '@angular/forms';
import { format } from 'date-fns';
import { parseTime } from '../../utils/date-time';

interface SessionRow {
  readonly id: string;
  readonly session: Session;
  start: string;
  end: string;
  duration: string;
  description: string;
}

@Component({
  selector: 'tt-sessions-table',
  templateUrl: './sessions-table.component.html',
  styleUrls: ['./sessions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class SessionsTableComponent implements OnChanges {
  @Input()
  sessions = new Array<Session>();
  @Output()
  readonly sessionChange = new EventEmitter<Update<Session>>();

  protected rows = new Array<SessionRow>();
  protected readonly trackById: TrackByFunction<SessionRow> = (index, item) => item.id;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['sessions']) {
      this.rows = createRows(this.sessions);
    }
  }

  protected onDescriptionChange(row: SessionRow): void {
    if (row.description === row.session.description) {
      return;
    }

    this.sessionChange.emit({ id: row.id, changes: { description: row.description } });
  }

  protected onStartChange(row: SessionRow): void {
    const start = parseTime(row.session.start, row.start);
    const startMs = +start;
    if (isNaN(startMs) || startMs === +row.session.start) {
      this.resetRow(row);
      return;
    }

    const end = +row.session.start + row.session.durationMs;

    this.sessionChange.emit({ id: row.id, changes: { start, durationMs: end - startMs } });
  }

  protected onEndChange(row: SessionRow): void {
    const end = parseTime(row.session.start, row.end);
    const durationMs = +end - +row.session.start;
    if (isNaN(durationMs) || durationMs < 0 || durationMs === row.session.durationMs) {
      this.resetRow(row);
      return;
    }

    this.sessionChange.emit({ id: row.id, changes: { durationMs } });
  }

  protected onDurationChange(row: SessionRow): void {
    const durationMs = parseDuration(row.duration);
    if (isNaN(durationMs) || durationMs === row.session.durationMs) {
      this.resetRow(row);
      return;
    }

    this.sessionChange.emit({
      id: row.id,
      changes: { durationMs },
    });
  }

  protected resetRow(row: SessionRow): void {
    fillRow(row, row.session);
  }
}

function createRows(sessions: Session[]): SessionRow[] {
  return sessions
    .map((session) => {
      const row = {
        id: session.id,
        description: '',
        start: '',
        end: '',
        duration: '',
        session,
      };
      fillRow(row, session);

      return row;
    })
    .sort((a, b) => {
      return a.start > b.start ? 1 : a.start < b.start ? -1 : 0;
    });
}

function fillRow(row: SessionRow, session: Session): void {
  const isActive = session.durationMs < 0;
  row.description = session.description;
  row.start = format(session.start, 'HH:mm');
  row.end = !isActive ? format(+session.start + session.durationMs, 'HH:mm') : '';
  row.duration = !isActive ? formatDuration(session.durationMs) : '';
}
