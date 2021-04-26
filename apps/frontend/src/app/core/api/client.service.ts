import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { CreateSessionDto, CreateSessionTagDto, ISession, ISessionTag } from '@tt/types';
import { forkJoin, Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { Update } from '@tt/core/store';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  constructor(@Inject(ENVIRONMENT) public env: IEnvironment, private readonly http: HttpClient) {}

  getSessions$(from: Date, to: Date): Observable<ISession[]> {
    const params = new HttpParams().set('from', from.toISOString()).set('to', to.toISOString());

    return this.http.get<ISession[]>(`${this.env.serverUrl}/sessions`, { params });
  }

  addSession$(session: CreateSessionDto): Observable<void> {
    return this.http.post<void>(`${this.env.serverUrl}/sessions`, session);
  }

  addSessions$(sessions: CreateSessionDto[]): Observable<void> {
    return forkJoin(
      sessions.map((session) => this.http.post<void>(`${this.env.serverUrl}/sessions`, session)),
    ).pipe(mapTo(undefined));
  }

  deleteSessions$(ids: string[]): Observable<void> {
    return forkJoin(
      ids.map((id) => {
        return this.http.delete<void>(`${this.env.serverUrl}/sessions/${id}`);
      }),
    ).pipe(mapTo(undefined));
  }

  updateSessions$(changes: Update<ISession>[]): Observable<void> {
    return forkJoin(
      changes.map((change) => {
        return this.http.patch<void>(`${this.env.serverUrl}/sessions/${change.id}`, change.changes);
      }),
    ).pipe(mapTo(undefined));
  }

  getSessionTags$(): Observable<ISessionTag[]> {
    return this.http.get<ISessionTag[]>(`${this.env.serverUrl}/tags`);
  }

  addSessionTag$(session: CreateSessionTagDto): Observable<void> {
    return this.http.post<void>(`${this.env.serverUrl}/tags`, session);
  }

  deleteSessionTags$(ids: string[]): Observable<void> {
    return forkJoin(
      ids.map((id) => {
        return this.http.delete<void>(`${this.env.serverUrl}/tags/${id}`);
      }),
    ).pipe(mapTo(undefined));
  }

  updateSessionTagss$(changes: Update<ISessionTag>[]): Observable<void> {
    return forkJoin(
      changes.map((change) => {
        return this.http.patch<void>(`${this.env.serverUrl}/tags/${change.id}`, change.changes);
      }),
    ).pipe(mapTo(undefined));
  }
}
