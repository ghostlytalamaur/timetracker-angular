import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EventsService } from './events.service';

@Injectable()
export class EventsInterceptor implements NestInterceptor {
  constructor(private readonly events: EventsService) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      switchMap((res) => {
        const request = context.switchToHttp().getRequest();
        const userId = request?.user?.sub;
        if (userId) {
          return this.events.flush(userId).then(() => res);
        } else {
          return of(res);
        }
      }),
    );
  }
}
