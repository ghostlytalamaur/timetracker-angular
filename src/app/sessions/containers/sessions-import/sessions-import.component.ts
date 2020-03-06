import { Component, OnInit } from '@angular/core';
import { SessionsService } from '../../services/sessions.service';
import { v4 as uuid } from 'uuid';
import { DateTime } from 'luxon';
import { Session, SessionEntity } from '../../models';

interface DayBackup {
  id: number;
  date: number;
  isWorkingDay: boolean;
  targetDuration: number;
}

interface SessionBackup {
  id: string;
  start: number;
  end: number;
}

interface SessionsBackup {
  days: DayBackup[];
  sessions: SessionBackup[];
}

function isDayBackup(day: any): day is DayBackup {
  // noinspection SuspiciousTypeOfGuard
  return typeof day.id === 'number' &&
    typeof day.date === 'number' &&
    typeof day.isWorkingDay === 'boolean' &&
    typeof day.targetDuration === 'number';

}

function isSessionBackup(session: any): session is SessionBackup {
  return typeof session.id === 'number' &&
    typeof session.start === 'number' &&
    typeof session.end === 'number';
}

function isSessionsBackup(backup: any): backup is SessionsBackup {
  if (Array.isArray(backup.days) && Array.isArray(backup.sessions)) {
    for (const day of backup.days) {
      if (!isDayBackup(day)) {
        return false;
      }
    }

    for (const s of backup.sessions) {
      if (!isSessionBackup(s)) {
        return false;
      }
    }

    return true;
  }
  return false;
}

@Component({
  selector: 'app-sessions-import',
  templateUrl: './sessions-import.component.html',
  styleUrls: ['./sessions-import.component.scss'],
})
export class SessionsImportComponent implements OnInit {

  constructor(
    private readonly sessionsSrv: SessionsService,
  ) {
  }

  ngOnInit() {
  }

  onImport(files: FileList) {
    if (!files || !files.length) {
      return;
    }

    const file = files.item(0);
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const json = reader.result as string;
      const sessions = JSON.parse(json);
      if (isSessionsBackup(sessions)) {
        this.importSessions(sessions);
      }
    };
    reader.readAsText(file);
  }

  private importSessions(backup: SessionsBackup) {
    const sessions: SessionEntity[] = [];
    for (const s of backup.sessions) {
      const start = DateTime.fromMillis(s.start * 1000);
      const end = DateTime.fromMillis(s.end * 1000);
      sessions.push(new Session(uuid(), start, end.diff(start)).toEntity());
    }
    this.sessionsSrv.addSessions(sessions);
  }
}
