import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventType, IEvents, IEventsData } from '@tt/types';
import { Observable, of, ReplaySubject } from 'rxjs';
import { delay, expand, filter, mergeMap, retryWhen, share, takeUntil } from 'rxjs/operators';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isDefined, Nullable } from '@tt/utils';

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
    this.events$ = of(null).pipe(
      expand((data: Nullable<IEventsData>) => this.getEvents$(data?.id)),
      filter(isDefined),
      mergeMap((data) => data.events),
      share(),
      takeUntil(this.destroy$$),
    );
  }

  on$<T extends EventType>(eventType: T): Observable<Extract<IEvents, { type: T }>> {
    return this.events$.pipe(
      filter((event): event is Extract<IEvents, { type: T }> => event.type === eventType),
    );
  }

  ngOnDestroy(): void {
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  private getEvents$(lastEventId: Nullable<string>): Observable<IEventsData> {
    return this.http
      .get<IEventsData>(`${this.env.serverUrl}/events`, {
        headers: lastEventId ? new HttpHeaders().set('Last-Event-ID', `${lastEventId}`) : undefined,
      })
      .pipe(retryWhen((errors) => errors.pipe(delay(5000 + Math.random() * 500))));
  }
}
