import { SimpleChange, SimpleChanges } from '@angular/core';

export interface TypedSimpleChange<T> extends SimpleChange {
  previousValue: T;
  currentValue: T;
}

export function hasChange<T, K extends keyof T>(directive: T, key: K, changes: SimpleChanges):
  changes is SimpleChanges & { [p in K]: TypedSimpleChange<T[K]> } {
  return key in changes;
}
