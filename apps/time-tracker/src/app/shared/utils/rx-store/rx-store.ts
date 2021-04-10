import { RxState } from '@rx-angular/state';
import { defer, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, repeatWhen, switchMap } from 'rxjs/operators';
import { Nullable } from '../nullable';
import { applyStateOperator, StateOperator } from '../operators';
import { select$ } from './rx-select';
import { errorStatus, getErrorMessage, isRequestedStatus, IStatus, requestedStatus, successStatus } from './status';

export interface LoadableState<T> {
  readonly data: Nullable<T>;
  readonly status: IStatus;
}

export abstract class LoadableStore<T, S extends LoadableState<T>> extends RxState<S> {

  protected constructor(initialState: S) {
    super();
    this.set(initialState);
    this.connect(this.loadEffect$(), applyStateOperator);
  }

  getStatus$(): Observable<IStatus> {
    return this.select('status');
  }

  getData$(): Observable<Nullable<T>> {
    return this.select('data');
  }

  request(): void {
    this.set(state => ({
      ...state,
      status: requestedStatus(state.status, true),
    }));
  }

  cancelRequest(): void {
    this.set(state => ({
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
    const load$ = defer(() => this.loadData$()).pipe(
      repeatWhen(() => this.invalidate$()),
      map(data => (state: S) => ({
        ...state,
        status: successStatus(state.status),
        data,
     })),
      catchError(err => of((state: S) => ({
        ...state,
        status: errorStatus(state.status, getErrorMessage(err)),
      }))),
    );

    return this.isRequested$().pipe(
      switchMap(isRequested => isRequested ? load$ : EMPTY),
    );
  }

}

export function idendity<T>(value: T): T {
  return value;
}
