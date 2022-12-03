export function pick<T, K extends keyof T>(key: K): (value: T) => T[K] {
  return (value: T) => value[key];
}
