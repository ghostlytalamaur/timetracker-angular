import { Controller, Headers, MessageEvent, Sse, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserId } from './auth/user-decorator';
import { EventsService } from './events.service';

@Controller({
  path: '/events',
})
export class EventsController {

  constructor(
    private readonly events: EventsService,
  ) {
  }

  @UseGuards(AuthGuard('jwt-query-param'))
  @Sse()
  getEvents(@UserId() userId: string, @Headers('last-event-id') lastEventId: string | undefined): Observable<MessageEvent> {
    return this.events.getEvents$(userId, lastEventId ? Number(lastEventId) : 0)
      .pipe(
        map(event => {
          return {
            data: event.event,
            id: `${event.id}`,
          };
        }),
      );
  }

}
