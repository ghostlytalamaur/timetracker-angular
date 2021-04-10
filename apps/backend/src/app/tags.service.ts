import { Injectable } from '@nestjs/common';
import { CreateSessionTagDto, EventType, ISessionTag } from '@timetracker/shared';
import { Collection, ObjectId } from 'mongodb';
import { EventsService } from './events.service';
import { MongoService } from './mongo.service';
import { SessionsService } from './sessions.service';
import { toObjectId } from './utils';

interface IMongoSessionTag {
  _id: ObjectId;
  label: string;
  userId: string;
}

@Injectable()
export class TagsService {

  constructor(
    private readonly mongo: MongoService,
    private readonly events: EventsService,
    private readonly sessions: SessionsService,
  ) {}

  async getSessionTags(userId: string): Promise<ISessionTag[]> {
    const tags = this.getCollection();
    const results = tags.find({
      userId,
    });

    const values = await results.toArray();

    return values.map(s => ({
      id: s._id.toHexString(),
      label: s.label,
    }));
  }

  async addSessionTag(userId: string, tag: CreateSessionTagDto): Promise<string> {
    const sessions = this.getCollection();
    const result = await sessions.insertOne({
      userId,
      label: tag.label,
    });
    const id = result.insertedId.toHexString();

    this.events.push(userId, { type: EventType.SessionTagsModified });

    return id;
  }

  async updateSessionTag(userId: string, id: string, tag: Partial<CreateSessionTagDto>): Promise<number> {
    const changes: Partial<IMongoSessionTag> = { };
    let hasChanges = false;
    if (tag.label) {
      changes.label = tag.label;
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
      this.events.push(userId, { type: EventType.SessionTagsModified });
    }

    return result.modifiedCount;
  }

  async deleteSessionTag(userId: string, id: string): Promise<void> {
    const sessions = this.getCollection();
    const result = await sessions.deleteOne({
      _id: toObjectId(id),
      userId,
    });
    if (result.deletedCount) {
      this.events.push(userId, { type: EventType.SessionTagsDeleted, data: { ids: [id] }})
      await this.sessions.deleteTagSessionsFromSession(userId, id);
    }
  }

  public getCollection(): Collection<IMongoSessionTag> {
    const client = this.mongo.client;
    const db = client.db('timetracker');
    const tags = db.collection('tags');

    return tags;
  }

}
