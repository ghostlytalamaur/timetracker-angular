import { Injectable, Logger } from '@nestjs/common';
import { hasSameEventType, IEvents, IEventsData, isDataEvent } from '@tt/shared';
import { BulkWriteOperation, Collection, ObjectId } from 'mongodb';
import { defer, from, Observable, of, Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { MongoService } from './mongo.service';

interface IMongoUserEvents {
  _id: ObjectId;
  userId: string;
  events: {
    eventType: string;
    eventData: object | null;
    eventId: number;
  }[];
}

function createEventsData(events: { id: number; event: IEvents }[]): IEventsData {
  const maxEventId = events.reduce((acc, event) => Math.max(acc, event.id), 0);
  return {
    id: `${maxEventId}`,
    events: events.map((event) => event.event),
  };
}

@Injectable()
export class EventsService {
  private readonly eventsQueues: Map<string, IEvents[]>;
  private readonly events$$: Subject<{ userId: string; id: number; events: IEvents[] }>;

  constructor(private readonly mongo: MongoService, private readonly logger: Logger) {
    this.events$$ = new Subject();
    this.eventsQueues = new Map();
  }

  getEvents$(userId: string, lastEventId: number): Observable<IEventsData> {
    return defer(() => from(this.loadLastEventId(userId))).pipe(
      switchMap((storedLastEventId) => {
        this.logger.debug(
          `Requested events above ${lastEventId}. Last stored event id: ${storedLastEventId}`,
          'Events',
        );
        if (lastEventId < 0) {
          return of({ id: `${storedLastEventId}`, events: [] });
        } else if (storedLastEventId > lastEventId) {
          this.logger.debug(
            `Load events for user ${userId} starting from ${lastEventId}`,
            'Events',
          );
          return from(this.loadEvents(userId, lastEventId)).pipe(map(createEventsData));
        } else {
          return this.events$$.pipe(
            filter((e) => e.userId === userId && e.events.length > 0),
            map(
              (data) =>
                <IEventsData>{
                  id: `${data.id}`,
                  events: data.events,
                },
            ),
          );
        }
      }),
    );
  }

  queue(userId: string, event: IEvents): void {
    let queue = this.eventsQueues.get(userId);
    if (!queue) {
      queue = new Array<IEvents>();
      this.eventsQueues.set(userId, queue);
    }
    if (isDataEvent(event) || !hasSameEventType(queue, event)) {
      queue.push(event);
    }
  }

  async flush(userId: string): Promise<void> {
    const queue = this.eventsQueues.get(userId);
    if (!queue) {
      return;
    }
    this.eventsQueues.delete(userId);

    const eventId = (await this.loadLastEventId(userId)) + 1;
    const operations = new Array<BulkWriteOperation<IMongoUserEvents>>();
    for (const event of queue) {
      operations.push(...EventsService.getUpsertOperations(userId, eventId, event));
    }
    const collection = await this.getCollection();
    await collection.bulkWrite(operations);
    this.events$$.next({ userId, id: eventId, events: queue });
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  private async loadLastEventId(userId: string): Promise<number> {
    const collection = await this.getCollection();
    const cursor = collection.aggregate<{ lastEventId: number }>([
      { $match: { userId } },
      { $unwind: { path: '$events' } },
      { $group: { _id: null, lastEventId: { $max: '$events.eventId' } } },
      { $project: { _id: 0, lastEventId: 1 } },
    ]);
    if (await cursor.hasNext()) {
      const doc = await cursor.next();

      return doc?.lastEventId ?? 0;
    }

    return 0;
  }

  private async loadEvents(
    userId: string,
    lastEventId: number,
  ): Promise<{ id: number; event: IEvents }[]> {
    const events = await this.getCollection();
    const result = await events
      .aggregate<{ eventType: string; eventData: object | null; eventId: number }>([
        { $match: { userId } },
        { $unwind: { path: '$events' } },
        { $match: { 'events.eventId': { $gt: lastEventId } } },
        { $project: { _id: 0, 'events.eventType': 1, 'events.eventData': 1, 'events.eventId': 1 } },
        { $replaceRoot: { newRoot: '$events' } },
      ])
      .toArray();

    return result.map((data) => {
      return <{ id: number; event: IEvents }>{
        event: {
          type: data.eventType,
          data: data.eventData,
        },
        id: data.eventId,
      };
    });
  }

  private static getUpsertOperations(
    userId: string,
    eventId: number,
    event: IEvents,
  ): BulkWriteOperation<IMongoUserEvents>[] {
    const eventData = isDataEvent(event) ? event.data : null;
    return [
      {
        updateOne: {
          filter: { userId },
          update: {
            $setOnInsert: {
              userId,
              events: [
                {
                  eventType: event.type,
                  eventData,
                  eventId,
                },
              ],
            },
          },
          upsert: true,
        },
      },
      {
        updateOne: {
          filter: { userId, events: { $elemMatch: { eventType: event.type, eventData } } },
          update: {
            $set: {
              'events.$.eventData': eventData,
              'events.$.eventId': eventId,
            },
          },
        },
      },
      {
        updateOne: {
          filter: { userId },
          update: {
            $addToSet: {
              events: {
                eventType: event.type,
                eventData,
                eventId,
              },
            },
          },
        },
      },
    ];
  }

  private getCollection(): Promise<Collection<IMongoUserEvents>> {
    return this.mongo.getCollection('events');
  }
}
