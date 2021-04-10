import { InjectionToken } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, ReplaySubject, timer } from 'rxjs';
import { multicast, refCount } from 'rxjs/operators';

export const TICKS_TIMER = new InjectionToken<Observable<number>>('App Ticks Observable', {
  providedIn: 'root',
  factory: () => timer(0, environment.settings.durationRate)
      .pipe(
        multicast(() => new ReplaySubject<number>(1)),
        refCount(),
      ),
});
