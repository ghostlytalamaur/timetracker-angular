import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';

export function select$<S, R>(state$: Observable<S>, selector: (state: S) => R): Observable<R> {
  return state$.pipe(
    map(state => selector(state)),
    distinctUntilChanged(),
  );
}
