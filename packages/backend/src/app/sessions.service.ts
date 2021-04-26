import { Injectable } from '@nestjs/common';
import { CreateSessionDto, EventType, ISession } from '@tt/types';
import { ObjectId } from 'bson';
import { Collection } from 'mongodb';
import { EventsService } from './events.service';
import { MongoService } from './mongo.service';
import { toObjectId } from './utils';

interface IMongoSession {
  _id: ObjectId;
  userId: string;
  start: Date;
  duration: number | null;
  tags?: ObjectId[];
}

@Injectable()
export class SessionsService {
  constructor(private readonly mongo: MongoService, private readonly events: EventsService) {}

  async getSessions(userId: string, from: Date, to: Date): Promise<ISession[]> {
    const collection = await this.getCollection();
    const results = collection.find({
      userId,
      $and: [
        {
          start: {
            $gte: from,
            $lte: to,
          },
        },
      ],
    });

    const values = await results.toArray();

    return values.map((s) => ({
      id: s._id.toHexString(),
      start: s.start.toISOString(),
      duration: s.duration,
      tags: s.tags?.map((id) => id.toHexString()) ?? [],
    }));
  }

  async addSession(userId: string, session: CreateSessionDto): Promise<string> {
    const collection = await this.getCollection();
    const result = await collection.insertOne({
      userId,
      start: new Date(session.start),
      duration: session.duration,
      tags: session.tags?.map(toObjectId) ?? [],
    });
    const id = result.insertedId.toHexString();

    this.events.queue(userId, { type: EventType.SessionsModified });

    return id;
  }

  async addSessions(userId: string, data: CreateSessionDto[]): Promise<void> {
    const collection = await this.getCollection();
    const list = data.map((session) => ({
      userId,
      start: new Date(session.start),
      duration: session.duration,
      tags: session.tags?.map(toObjectId) ?? [],
    }));
    await collection.insertMany(list);
  }

  async updateSession(
    userId: string,
    id: string,
    session: Partial<CreateSessionDto>,
  ): Promise<number> {
    const changes: Partial<IMongoSession> = {};
    let hasChanges = false;
    if (typeof session.duration === 'number' || session.duration === null) {
      changes.duration = session.duration;
      hasChanges = true;
    }
    if (typeof session.start === 'string') {
      changes.start = new Date(session.start);
      hasChanges = true;
    }
    if (session.tags) {
      changes.tags = session.tags.map(toObjectId);
      hasChanges = true;
    }

    if (!hasChanges) {
      return 0;
    }

    const collection = await this.getCollection();
    const result = await collection.updateOne(
      {
        _id: toObjectId(id),
        userId,
      },
      {
        $set: changes,
      },
    );
    if (result.modifiedCount) {
      this.events.queue(userId, { type: EventType.SessionsModified });
    }

    return result.modifiedCount;
  }

  async deleteSession(userId: string, id: string): Promise<number> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({
      _id: toObjectId(id),
      userId,
    });
    if (result.deletedCount) {
      this.events.queue(userId, { type: EventType.SessionsDeleted, data: { ids: [id] } });
    }

    return result.deletedCount ?? 0;
  }

  async deleteTagSessionsFromSession(userId: string, tagId: string): Promise<void> {
    const collection = await this.getCollection();
    const result = await collection.updateMany(
      {
        userId: userId,
      },
      {
        $pull: {
          tags: toObjectId(tagId),
        },
      },
    );

    if (result.modifiedCount) {
      this.events.queue(userId, { type: EventType.SessionsModified });
    }
  }

  private getCollection(): Promise<Collection<IMongoSession>> {
    return this.mongo.getCollection('session');
  }
}
