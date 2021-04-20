import { RxState } from '@rx-angular/state';
import { defer, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Nullable } from '@tt/core/util';
import { applyStateOperator, StateOperator } from '../operators';
import { select$ } from './rx-select';
import {
  errorStatus,
  getErrorMessage,
  isRequestedStatus,
  IStatus,
  loadingStatus,
  requestedStatus,
  successStatus,
} from './status';

export interface LoadableState<T> {
  readonly data: Nullable<T>;
  readonly status: IStatus;
}

export abstract class LoadableStore<T, S extends LoadableState<T>> extends RxState<S> {
  protected constructor(initialState: S, enableLog: boolean = false) {
    super();
    (this as any as { accumulator: { state: S } }).accumulator.state = initialState;
    this.connect(this.loadEffect$(), applyStateOperator);
    if (enableLog) {
      this.hold(this.select(), console.log);
    }
  }

  getStatus$(): Observable<IStatus> {
    return this.select('status');
  }

  getData$(): Observable<Nullable<T>> {
    return this.select('data');
  }

  request(): void {
    this.set((state) => ({
      ...state,
      status: requestedStatus(state.status, true),
    }));
  }

  cancelRequest(): void {
    this.set((state) => ({
      ...state,
      status: requestedStatus(this.get('status'), false),
    }));
  }

  protected abstract loadData$(): Observable<Nullable<T>>;
  protected abstract invalidate$(): Observable<unknown>;

  private isRequested$(): Observable<boolean> {
    return select$(this.getStatus$(), isRequestedStatus);
  }

  private loadEffect$(): Observable<StateOperator<S>> {
    const load$ = defer(() => {
      return this.loadData$();
    }).pipe(
      map((data) => {
        return (state: S) => ({
          ...state,
          status: successStatus(state.status),
          data,
        });
      }),
      catchError((err) =>
        of((state: S) => ({
          ...state,
          status: errorStatus(state.status, getErrorMessage(err)),
        })),
      ),
    );

    return this.isRequested$().pipe(
      switchMap((isRequested) => {
        if (isRequested) {
          return this.invalidate$().pipe(
            startWith(null), // FIXME: start load only when data is not valid
            switchMap(() => {
              return load$.pipe(
                startWith((state: S) => {
                  return {
                    ...state,
                    status: loadingStatus(state.status),
                  };
                }),
              );
            }),
          );
        } else {
          return EMPTY;
        }
      }),
    );
  }
}

export function idendity<T>(value: T): T {
  return value;
}
