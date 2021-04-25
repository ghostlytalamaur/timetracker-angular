export interface Range<T> {
  readonly start: T;
  readonly end: T;
}

export function withStart<T>(base: Range<T>, start: T): Range<T> {
  return { ...base, start };
}

export function withEnd<T>(base: Range<T>, end: T): Range<T> {
  return { ...base, end };
}

export function isInRange<T>(value: T, range: Range<T>): boolean {
  return range.start <= value && value <= range.end;
}
