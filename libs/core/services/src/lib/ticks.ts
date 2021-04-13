import { inject, InjectionToken } from '@angular/core';
import { Observable, ReplaySubject, timer } from 'rxjs';
import { multicast, refCount } from 'rxjs/operators';
import { ENVIRONMENT } from './env';

export const TICKS_TIMER = new InjectionToken<Observable<number>>('App Ticks Observable', {
  providedIn: 'root',
  factory: () =>
    timer(0, inject(ENVIRONMENT).settings.durationRate).pipe(
      multicast(() => new ReplaySubject<number>(1)),
      refCount(),
    ),
});
