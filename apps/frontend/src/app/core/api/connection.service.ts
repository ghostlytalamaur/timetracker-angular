import { interval, Observable, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ENVIRONMENT, IEnvironment } from '@app/core/services';
import { catchError, mapTo, shareReplay, startWith, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  private readonly options = {
    healthUrl: `${this.env.serverUrl}/health`,
    pollingInterval: 5000, // ms
  } as const;
  private readonly mIsOnline$: Observable<boolean>;

  constructor(
    private readonly http: HttpClient,
    @Inject(ENVIRONMENT) private readonly env: IEnvironment,
  ) {
    this.mIsOnline$ = interval(this.options.pollingInterval).pipe(
      startWith(undefined),
      switchMap(() => {
        return this.http.head(this.options.healthUrl).pipe(
          mapTo(true),
          catchError(() => of(false)),
        );
      }),
      startWith(false),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  isOnline$(): Observable<boolean> {
    return this.mIsOnline$;
  }
}
