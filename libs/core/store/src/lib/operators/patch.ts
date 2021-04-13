import { isStateOperator, StateOperator } from './operator-types';

export function patchObject<T extends object>(state: T, patchSpec: PatchSpec<T>): T {
  return patch(patchSpec)(state);
}

export type PatchSpec<T> = { [P in keyof T]?: T[P] | StateOperator<NonNullable<T[P]>> };

type PatchValues<T> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly [P in keyof T]?: T[P] extends (...args: any[]) => infer R ? R : T[P];
};

type PatchOperator<T> = <U extends PatchValues<T>>(existing: Readonly<U>) => U;

export function patch<T>(patchObject: PatchSpec<T>): PatchOperator<T> {
  return function patchStateOperator<U extends PatchValues<T>>(existing: Readonly<U>): U {
    let clone = null;
    for (const k in patchObject) {
      const newValue = patchObject[k];
      const existingPropValue = existing[k];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newPropValue = isStateOperator(newValue) ? newValue(<any>existingPropValue) : newValue;
      if (newPropValue !== existingPropValue) {
        if (!clone) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          clone = { ...(<any>existing) };
        }
        clone[k] = newPropValue;
      }
    }
    return clone || existing;
  };
}
