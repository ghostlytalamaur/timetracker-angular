import { isPredicate, Predicate, StateOperator } from './operator-types';

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

export function invalidIndex(index: number): boolean {
  return Number.isNaN(index) || index === -1;
}

export function removeItem<T>(selector: number | Predicate<T>): StateOperator<T[]> {
  return function removeItemOperator(existing: Readonly<T[]>): T[] {
    let index = -1;

    if (isPredicate(selector)) {
      index = existing.findIndex(selector);
    } else if (isNumber(selector)) {
      index = selector;
    }

    if (invalidIndex(index)) {
      return existing as T[];
    }

    const clone = existing.slice();
    clone.splice(index, 1);

    return clone;
  };
}
