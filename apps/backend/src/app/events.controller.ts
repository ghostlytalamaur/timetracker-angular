import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { asyncScheduler, of, race } from 'rxjs';
import { bufferTime, delay, filter, map, take } from 'rxjs/operators';
import { UserId } from './auth/user-decorator';
import { EventsService } from './events.service';
import { IEvents } from '@tt/shared';

@Controller({
  path: '/events',
})
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getEvents(
    @UserId() userId: string,
    @Headers('last-event-id') header: string | undefined,
  ): Promise<{ id: string; data: IEvents[] }> {
    let lastEventId = header ? Number(header) : 0;
    if (!Number.isFinite(lastEventId)) {
      lastEventId = 0;
    }

    const pushedEvents$ = this.events
      .getEvents$(userId, lastEventId)
      .pipe(
        bufferTime(100, asyncScheduler),
        map((data) => {
          const eventId = data.reduce((acc, event) => Math.max(acc, event.id), lastEventId);

          return {
            id: `${eventId}`,
            data: data.map((event) => event.event),
          };
        }),
        filter((data) => !!data.data.length),
        take(1),
      )
      .toPromise();
    const timeout$ = of({ id: `${lastEventId}`, data: new Array<IEvents>() }).pipe(delay(30 * 1000));

    return race(pushedEvents$, timeout$).toPromise();
  }
}
