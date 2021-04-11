import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ImportDataDto } from '@timetracker/shared';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { environment } from 'apps/time-tracker/src/environments/environment';
import { Duration } from 'luxon';

interface SessionsBackup {
  readonly sessions: {
    id: string;
    start: string; // ISO Date "2021-04-02T08:10:12.312+03:00"
    duration: string; //ISO Duration "PT35122.878S",
    tags: string[]; // tags ids
  }[];
  readonly tags: {
    id: string;
    label: string;
    sessions: string[]; // sessions ids
  }[];
}

@Component({
  selector: 'app-sessions-import',
  templateUrl: './sessions-import.component.html',
  styleUrls: ['./sessions-import.component.scss'],
})
export class SessionsImportComponent {
  constructor(private readonly http: HttpClient) {}

  onImport(files: FileList | null) {
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
      this.importSessions(sessions);
    };
    reader.readAsText(file);
  }

  private importSessions(backup: SessionsBackup) {
    const sessions: ImportDataDto = {
      sessions: [],
      tags: backup.tags,
    };
    for (const s of backup.sessions) {
      sessions.sessions.push({
        id: s.id,
        duration: Duration.fromISO(s.duration).valueOf(),
        start: s.start,
        tags: s.tags,
      });
    }
    this.http.post<void>(`${environment.serverUrl}/import`, sessions).subscribe();
  }
}
