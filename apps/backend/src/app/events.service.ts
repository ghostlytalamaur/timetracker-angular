import { Injectable, Logger } from '@nestjs/common';
import { IEvents } from '@timetracker/shared';
import { Collection, ObjectId } from 'mongodb';
import { defer, from, merge, Observable, Subject } from 'rxjs';
import { filter, map, switchMap, tap } from 'rxjs/operators';
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

@Injectable()
export class EventsService {
  private readonly events$$: Subject<{ userId: string; id: number; event: IEvents }>;

  constructor(private readonly mongo: MongoService, private readonly logger: Logger) {
    this.events$$ = new Subject();
  }

  getEvents$(userId: string, lastEventId: number): Observable<{ id: number; event: IEvents }> {
    return defer(() => {
      const userEvents$ = this.events$$.pipe(
        filter((e) => e.userId === userId),
        map((e) => ({ id: e.id, event: e.event })),
      );
      if (lastEventId) {
        this.logger.debug(`Load events for user ${userId} starting from ${lastEventId}`);
        const storedEvents$ = from(this.loadEvents(userId, lastEventId)).pipe(
          tap((events) =>
            this.logger.debug(`Loaded events: ${JSON.stringify(events, undefined, 4)}`),
          ),
          switchMap((events) => events),
        );

        return merge(storedEvents$, userEvents$);
      } else {
        return userEvents$;
      }
    });
  }

  push(userId: string, event: IEvents): void {
    this.pushAsync(userId, event);
  }

  private async pushAsync(userId: string, event: IEvents): Promise<void> {
    const id = (await this.loadLastEventId(userId)) + 1;
    this.events$$.next({ id, userId, event });
    this.storeMessage(userId, id, event);
  }

  private async loadLastEventId(userId: string): Promise<number> {
    const events = this.getCollection();
    const cursor = events.aggregate<{ lastEventId: number }>([
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
    const events = this.getCollection();
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

  private async storeMessage(userId: string, eventId: number, event: IEvents): Promise<void> {
    const events = this.getCollection();
    const eventData = 'data' in event ? (event as { data: object }).data : null;
    await events.bulkWrite([
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
    ]);
  }

  private getCollection(): Collection<IMongoUserEvents> {
    const client = this.mongo.client;
    const db = client.db('timetracker');
    const events = db.collection('events');

    return events;
  }
}
