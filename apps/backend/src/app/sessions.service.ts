import { Injectable } from '@nestjs/common';
import { CreateSessionDto, EventType, ISession } from '@timetracker/shared';
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

  constructor(
    private readonly mongo: MongoService,
    private readonly events: EventsService,
  ) {
  }

  async getSessions(userId: string): Promise<ISession[]> {
    const sessions = this.getCollection();
    const results = sessions.find({
      userId,
    });

    const values = await results.toArray();


    return values.map(s => ({
      id: s._id.toHexString(),
      start: s.start.toISOString(),
      duration: s.duration,
      tags: s.tags?.map(id => id.toHexString()) ?? [],
    }));
  }

  async addSession(userId: string, session: CreateSessionDto): Promise<string> {
    const sessions = this.getCollection();
    const result = await sessions.insertOne({
      userId,
      start: new Date(session.start),
      duration: session.duration,
      tags: session.tags?.map(toObjectId) ?? [],
    });
    const id = result.insertedId.toHexString();

    this.events.push(userId, { type: EventType.SessionsModified });

    return id;
  }

  async updateSession(userId: string, id: string, session: Partial<CreateSessionDto>): Promise<number> {
    const changes: Partial<IMongoSession> = { };
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

    const sessions = this.getCollection();
    const result = await sessions.updateOne(
      {
        _id: toObjectId(id),
        userId,
      },
      {
        $set: changes,
      },
    );
    if (result.modifiedCount) {
      this.events.push(userId, { type: EventType.SessionsModified });
    }

    return result.modifiedCount;
  }

  async deleteSession(userId: string, id: string): Promise<number> {
    const sessions = this.getCollection();
    const result = await sessions.deleteOne({
      _id: toObjectId(id),
      userId,
    });
    if (result.deletedCount) {
      this.events.push(userId, { type: EventType.SessionsDeleted, data: { ids: [id] }})
    }

    return result.deletedCount ?? 0;
  }

  async deleteTagSessionsFromSession(userId: string, tagId: string): Promise<void> {
    const sessions = this.getCollection();
    const result = await sessions.updateMany(
      {
        userId: userId,
      },
      {
        $pull: {
          tags: toObjectId(tagId),
        },
      }
    )

    if (result.modifiedCount) {
      this.events.push(userId, { type: EventType.SessionsModified });
    }
  }

  private getCollection(): Collection<IMongoSession> {
    const client = this.mongo.client;
    const db = client.db('timetracker');
    const sessions = db.collection('session');

    return sessions;
  }

}
