import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { asapScheduler, BehaviorSubject, Observable, queueScheduler, scheduled, Subject } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { StateOperator } from '../operators';
import { patch, PatchSpec } from '../operators/patch';

export type Selector<T, R> = (state: T) => R;

export const INITIAL_STATE = new InjectionToken('Initial state for LocalStore');

const LOG_STATE_CHANGES = true;

@Injectable()
export class LocalStore<T extends object> implements OnDestroy {

  private readonly destroy$$: Subject<void>;
  private readonly state$$: BehaviorSubject<T>;
  private readonly modifications$$: Subject<StateOperator<T>>;

  public constructor(@Inject(INITIAL_STATE) initialState: T) {
    this.destroy$$ = new Subject();
    this.state$$ = new BehaviorSubject(initialState);
    this.modifications$$ = new Subject();
    this.watchModifications();
  }

  public ngOnDestroy(): void {
    this.state$$.complete();
    this.modifications$$.complete();
    this.destroy$$.next();
    this.destroy$$.complete();
  }

  public get(): T;
  public get<R>(selector: Selector<T, R>): R;
  public get<K extends keyof T>(key: K): T[K];
  public get<K extends keyof T, R>(selectorOrKey?: Selector<T, R> | K): T | R | T[K] {
    if (typeof selectorOrKey === 'function') {
      return selectorOrKey(this.state$$.value);
    } else if (selectorOrKey) {
      return this.state$$.value[selectorOrKey];
    } else {
      return this.state$$.value;
    }
  }

  public setState(state: T): void {
    queueScheduler.schedule(() => this.state$$.next(state));
  }

  public patchState(statePatch: PatchSpec<T>): void {
    this.modifications$$.next(patch(statePatch));
  }

  public select<R>(selector: Selector<T, R>): Observable<R> {
    return this.state$$.pipe(
      debounceTime(0, asapScheduler),
      map(value => selector(value)),
      distinctUntilChanged(),
    );
  }

  protected hold(effect$: Observable<unknown>): void {
    effect$
      .pipe(takeUntil(this.destroy$$))
      .subscribe();
  }

  public connect(effect$: Observable<StateOperator<T>>): void {
    effect$
      .pipe(takeUntil(this.destroy$$))
      .subscribe(operator => this.modifications$$.next(operator));
  }

  private watchModifications(): void {
    this.modifications$$
      .pipe(
        concatMap(operator => scheduled([operator], queueScheduler)),
        takeUntil(this.destroy$$),
      )
      .subscribe(operator => {
        const prevState = this.state$$.value;
        const newState = operator(prevState);
        if (LOG_STATE_CHANGES) {
          console.group('State changes');
          console.log('prev state', prevState);
          console.log('new state', newState)
          console.groupEnd();
        }
        this.state$$.next(newState);
      });
  }
}
