import { hasKey, isObject } from '@tt/utils';

export interface IEvent<T extends string> {
  readonly type: T;
}

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

export interface IEventsData {
  readonly id: string;
  readonly events: IEvents[];
}

const DATA_EVENT_TYPES = [EventType.SessionsDeleted, EventType.SessionTagsDeleted] as const;
type DataEventTypes = typeof DATA_EVENT_TYPES[number];

export function isDataEvent(
  event: unknown,
): event is Extract<IEvents, { type: Extract<EventType, DataEventTypes> }> {
  debugger
  return isObject(event) && hasKey(event, 'type') && DATA_EVENT_TYPES.some((t) => event.type === t);
}

export function hasSameEventType(events: IEvents[], event: IEvents): boolean {
  return events.some((e) => e.type === event.type);
}
