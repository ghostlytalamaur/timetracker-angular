import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';
import { performance } from 'perf_hooks';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  constructor(private readonly logger: Logger) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<unknown>,
  ): Observable<unknown> | Promise<Observable<unknown>> {
    const start = performance.now();
    const url = context.switchToHttp().getRequest<Request>().url;
    if (url.startsWith('/health')) {
      return next.handle();
    }

    const method = context.switchToHttp().getRequest<Request>().method;
    this.logger.log(`Start processing request ${url}`, method);
    return next.handle().pipe(
      tap(() => {
        const time = (performance.now() - start).toFixed(4);
        this.logger.log(`Request ${url} processed in ${time} ms`, method);
      }),
    );
  }
}
