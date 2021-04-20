export function isDefined<T>(value: T | null | undefined): value is T {
  return typeof value !== 'undefined' && value !== null;
}

export function isObject(value: unknown): value is object {
  return isDefined(value) && typeof value === 'object';
}

export function hasKey<T extends object, K extends string>(
  obj: T,
  key: K,
): obj is T & { [P in K]: unknown } {
  return key in obj;
}
