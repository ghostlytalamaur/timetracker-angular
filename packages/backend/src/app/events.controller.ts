import { Controller, Get, Headers, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { of, race } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { UserId } from './auth/user-decorator';
import { EventsService } from './events.service';
import { IEvents, IEventsData } from '@tt/shared';

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
  ): Promise<IEventsData> {
    let lastEventId = header ? Number(header) : -1;
    if (!Number.isFinite(lastEventId)) {
      lastEventId = -1;
    }

    const pushedEvents$ = this.events.getEvents$(userId, lastEventId).pipe(take(1)).toPromise();
    const timeout$ = of<IEventsData>({ id: `${lastEventId}`, events: new Array<IEvents>() }).pipe(
      delay(30 * 1000),
    );

    return race(pushedEvents$, timeout$).toPromise();
  }
}
