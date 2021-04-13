import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventType, IEvents } from '@timetracker/shared';
import { fromEvent, Observable, ReplaySubject, Subscription } from 'rxjs';
import { filter, share, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '@tt/auth/core';
import { ENVIRONMENT, IEnvironment } from '@tt/core/services';

@Injectable({
  providedIn: 'root',
})
export class EventsService implements OnDestroy {
  private readonly destroy$$: ReplaySubject<void>;
  private readonly events$: Observable<IEvents>;

  constructor(
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
    private readonly auth: AuthService,
  ) {
    this.destroy$$ = new ReplaySubject(1);
    this.events$ = this.auth.accessToken$.pipe(
      switchMap((accessToken) => this.createEventsSource(accessToken)),
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

  private createEventsSource(accessToken: string): Observable<IEvents> {
    return new Observable<IEvents>((subscriber) => {
      const subscription = new Subscription();
      const eventSource = new EventSource(
        `${this.env.serverUrl}/events?access_token=${accessToken}`,
      );

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
            subscriber.complete();
          }
        }),
      );
      subscription.add(() => eventSource.close());

      return subscription;
    }).pipe(share(), takeUntil(this.destroy$$));
  }
}
