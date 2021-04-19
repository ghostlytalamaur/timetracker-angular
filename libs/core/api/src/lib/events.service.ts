import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventType, IEvents } from '@tt/shared';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, expand, filter, mergeMap, retryWhen, share, takeUntil } from 'rxjs/operators';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService implements OnDestroy {
  private readonly destroy$$: ReplaySubject<void>;
  private readonly events$: Observable<IEvents>;

  constructor(
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
    private readonly http: HttpClient,
  ) {
    this.destroy$$ = new ReplaySubject(1);
    this.events$ = of({ id: '0', data: [] }).pipe(
      expand((data) => this.getEvents$(data.id)),
      mergeMap((data) => data.data),
      share(),
      takeUntil(this.destroy$$),
    );
  }

  on$<T extends EventType>(eventType: T): Observable<Extract<IEvents, { type: T }>> {
    return this.events$.pipe(
      filter((event: IEvents): event is Extract<IEvents, { type: T }> => event.type == eventType),
    );
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getEvents$(lastEventId: string): Observable<{ id: string; data: IEvents[] }> {
    return this.http
      .get<{ id: string; data: IEvents[] }>(`${this.env.serverUrl}/events`, {
        headers: new HttpHeaders().set('Last-Event-ID', `${lastEventId}`),
      })
      .pipe(retryWhen((errors) => errors.pipe(delay(1000))));
  }
}
