import { Injectable } from '@nestjs/common';
import { CreateSessionTagDto, EventType, ImportDataDto, ISessionTag } from '@tt/types';
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
    const collection = await this.getCollection();
    const results = collection.find({
      userId,
    });

    const values = await results.toArray();

    return values.map((s) => ({
      id: s._id.toHexString(),
      label: s.label,
    }));
  }

  async addSessionTag(userId: string, tag: CreateSessionTagDto): Promise<string> {
    const collection = await this.getCollection();
    const result = await collection.insertOne({
      userId,
      label: tag.label,
    });
    const id = result.insertedId.toHexString();

    this.events.queue(userId, { type: EventType.SessionTagsModified });

    return id;
  }

  async addSessionTags(
    userId: string,
    tags: ImportDataDto['tags'],
  ): Promise<Record<string, string>> {
    const collection = await this.getCollection();
    const data = tags.map((tag) => ({
      userId,
      label: tag.label,
    }));
    const insertResult = await collection.insertMany(data);
    const idsMap: Record<string, string> = {};
    for (let i = 0; i < tags.length; i++) {
      idsMap[tags[i].id] = insertResult.insertedIds[i].toHexString();
    }

    return idsMap;
  }

  async updateSessionTag(
    userId: string,
    id: string,
    tag: Partial<CreateSessionTagDto>,
  ): Promise<number> {
    const changes: Partial<IMongoSessionTag> = {};
    let hasChanges = false;
    if (tag.label) {
      changes.label = tag.label;
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
      this.events.queue(userId, { type: EventType.SessionTagsModified });
    }

    return result.modifiedCount;
  }

  async deleteSessionTag(userId: string, id: string): Promise<void> {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({
      _id: toObjectId(id),
      userId,
    });
    if (result.deletedCount) {
      await this.sessions.deleteTagSessionsFromSession(userId, id);
      this.events.queue(userId, { type: EventType.SessionTagsDeleted, data: { ids: [id] } });
    }
  }

  public getCollection(): Promise<Collection<IMongoSessionTag>> {
    return this.mongo.getCollection('tags');
  }
}
