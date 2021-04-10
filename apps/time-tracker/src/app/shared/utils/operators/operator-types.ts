export type StateOperator<T> = (state: T) => T;

export type Predicate<T> = (value: T) => boolean;

export function isPredicate<T>(value: unknown): value is Predicate<T> {
  return typeof value === 'function';
}

export function isStateOperator<T>(value: T | StateOperator<T> | undefined): value is StateOperator<T> {
  return typeof value === 'function';
}

export function applyStateOperator<T>(oldState: T, operator: StateOperator<T>): Partial<T> {
  return operator(oldState);
}
