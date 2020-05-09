import { generateUUID } from '@app/shared/utils';

export interface SessionTag {
  readonly id: string;
  readonly label: string;
}

export function createSessionTag(label: string): SessionTag {
  return {
    id: generateUUID(),
    label,
  };
}
