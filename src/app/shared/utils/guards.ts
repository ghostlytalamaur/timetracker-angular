export function isDefined<T>(value: T | null | undefined): value is T {
  return typeof value === 'object' && value !== null;
}
