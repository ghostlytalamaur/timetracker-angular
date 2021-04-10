import { Predicate, StateOperator } from './operator-types';

export function filterArray<T>(predicate: Predicate<T>): StateOperator<T[]> {
  return values => values.filter(value => predicate(value));
}
