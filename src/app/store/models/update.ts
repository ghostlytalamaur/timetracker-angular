export interface EntityType {
  id: string;
}

export type Update<T> = EntityType & Partial<T>;
