export interface Update<T> {
  readonly id: string;
  readonly changes: Partial<T>;
}
