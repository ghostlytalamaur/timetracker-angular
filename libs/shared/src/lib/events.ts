export interface IEvent<T extends string> {
  readonly type: T;
}

// eslint-disable-next-line @typescript-eslint/ban-types
interface IDataEvent<T extends string, D extends object> {
  readonly type: T;
  readonly data: Readonly<D>;
}

export const enum EventType {
  SessionsModified = 'sessionsModified',
  SessionsDeleted = 'sessionsDeleted',

  SessionTagsModified = 'sessionsTagsModified',
  SessionTagsDeleted = 'sessionsTagsDeleted',
}

export type ISessionsModifiedEvent = IEvent<EventType.SessionsModified>;
export type ISessionsDeletedEvent = IDataEvent<EventType.SessionsDeleted, { ids: string[] }>;

export type ISessionTagsModifiedEvent = IEvent<EventType.SessionTagsModified>;
export type ISessionTagsDeletedEvent = IDataEvent<EventType.SessionTagsDeleted, { ids: string[] }>;

export type IEvents =
  | ISessionsDeletedEvent
  | ISessionsModifiedEvent
  | ISessionTagsModifiedEvent
  | ISessionTagsDeletedEvent;
