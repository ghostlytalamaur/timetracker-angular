import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventType, IEvents } from '@tt/shared';
import { fromEvent, Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, retryWhen, share, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '@tt/auth/core';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';
import { ConnectionService } from './connection.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class EventsService implements OnDestroy {
  private readonly destroy$$: ReplaySubject<void>;
  private readonly events$: Observable<IEvents>;

  constructor(
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
    private readonly auth: AuthService,
    private readonly connection: ConnectionService,
    private readonly http: HttpClient,
  ) {
    this.destroy$$ = new ReplaySubject(1);
    this.events$ = this.http
      .post(`${this.env.serverUrl}/events`, null, { responseType: 'text' })
      .pipe(
        switchMap((slt) => {
          return this.createEventsSource(`${this.env.serverUrl}/events?slt=${slt}`);
        }),
        share(),
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

  private createEventsSource(url: string): Observable<IEvents> {
    return new Observable<IEvents>((subscriber) => {
      const subscription = new Subscription();
      const eventSource = new EventSource(url);

      subscription.add(
        fromEvent<MessageEvent>(eventSource, 'message').subscribe((event) => {
          const eventData = JSON.parse(event.data);

          subscriber.next(eventData);
        }),
      );

      subscription.add(
        fromEvent(eventSource, 'error').subscribe(() => {
          if (eventSource.readyState === EventSource.CLOSED) {
            subscriber.error(new Error('Events stream is closed'));
          }
        }),
      );
      subscription.add(() => eventSource.close());

      return subscription;
    }).pipe(
      share(),
      retryWhen(() => {
        return this.connection.isOnline$();
      }),
      takeUntil(this.destroy$$),
    );
  }
}
