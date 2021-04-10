import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Update } from '@app/store';
import { CreateSessionDto, ISession, ISessionTag, CreateSessionTagDto } from '@timetracker/shared';
import { forkJoin, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ClientService {

  constructor(
    private readonly http: HttpClient,
  ) {
  }

  getSessions$(): Observable<ISession[]> {
    return this.http.get<ISession[]>(`${environment.serverUrl}/sessions`);
  }

  addSession$(session: CreateSessionDto): Observable<void> {
    return this.http.post<void>(`${environment.serverUrl}/sessions`, session);
  }

  addSessions$(sessions: CreateSessionDto[]): Observable<void> {
    return forkJoin(
      sessions.map(session => this.http.post<void>(`${environment.serverUrl}/sessions`, session))
    )
      .pipe(mapTo(undefined));
  }

  deleteSessions$(ids: string[]): Observable<void> {
    return forkJoin(ids.map(id => {
      return this.http.delete<void>(`${environment.serverUrl}/sessions/${id}`);
    }))
      .pipe(mapTo(undefined));
  }

  updateSessions$(changes: Update<ISession>[]): Observable<void> {
    return forkJoin(changes.map(change => {
      return this.http.patch<void>(`${environment.serverUrl}/sessions/${change.id}`, change.changes)
    }))
      .pipe(mapTo(undefined));
  }

  getSessionTags$(): Observable<ISessionTag[]> {
    return this.http.get<ISessionTag[]>(`${environment.serverUrl}/tags`);
  }

  addSessionTag$(session: CreateSessionTagDto): Observable<void> {
    return this.http.post<void>(`${environment.serverUrl}/tags`, session);
  }

  deleteSessionTags$(ids: string[]): Observable<void> {
    return forkJoin(ids.map(id => {
      return this.http.delete<void>(`${environment.serverUrl}/tags/${id}`);
    }))
      .pipe(mapTo(undefined));
  }

  updateSessionTagss$(changes: Update<ISessionTag>[]): Observable<void> {
    return forkJoin(changes.map(change => {
      return this.http.patch<void>(`${environment.serverUrl}/tags/${change.id}`, change.changes)
    }))
      .pipe(mapTo(undefined));
  }
}
