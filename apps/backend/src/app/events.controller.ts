import {
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  MessageEvent,
  Post,
  Query,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { defer, from, Observable, throwError } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { UserId } from './auth/user-decorator';
import { EventsService } from './events.service';
import { MongoService } from './mongo.service';
import { toObjectId } from './utils';

@Controller({
  path: '/events',
})
export class EventsController {
  constructor(private readonly events: EventsService, private readonly db: MongoService) {}

  @Sse()
  sseEvents(
    @Query('slt') slt: string,
    @Headers('last-event-id') lastEventId: string | undefined,
  ): Observable<MessageEvent> {
    return from(this.getUserId(slt)).pipe(
      switchMap((userId) => {
        return this.events.getEvents$(userId, lastEventId ? Number(lastEventId) : 0).pipe(
          map((event) => {
            return {
              data: event.event,
              id: `${event.id}`,
            }
          }),
        );
      }),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async onPost(@UserId() userId: string): Promise<string> {
    const collection = this.getCollection();
    const res = await collection.insertOne({
      userId,
    });

    return res.insertedId.toHexString();
  }

  private async getUserId(slt: string): Promise<string> {
    const collection = this.getCollection();
    const filter = {
      _id: toObjectId(slt),
    };
    const result = await collection.findOne(filter);

    if (!result) {
      throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
    }

    await collection.deleteOne(filter);

    return result.userId;
  }

  private getCollection() {
    return this.db.client.db('timetracker').collection<{ userId: string }>('tokens');
  }
}
