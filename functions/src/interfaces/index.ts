export const enum FireCollections {
  Sessions = 'sessions',
  Tags = 'sessions-tags',
}

export interface UpdateSessionTagsParams {
  sessionId: string;
  tagId: string;
  append: boolean;
}

export interface FireSessionEntity {
  id: string;
  start: unknown; // firebase.firestore.Timestamp;
  duration: number | null;
  tags?: string[];
}

export interface FireTagEntity {
  id: string;
  label: string;
  sessions: string[];
}

export function isUpdateSessionTagsParams(data: any): data is UpdateSessionTagsParams {
  return (
    typeof data === 'object' &&
    data !== null &&
    'sessionId' in data &&
    typeof data.sessionId === 'string' &&
    data.sessionId &&
    'tagId' in data &&
    typeof data.tagId === 'string' &&
    data.tagId
  );
}

export function getCollectionPath(uid: string, collection: FireCollections): string {
  return `users/${uid}/${collection}`;
}
