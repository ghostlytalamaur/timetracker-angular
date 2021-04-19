import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: Logger) {
  }
  use(req: Request, res: Response, next: () => void) {
    this.logger.log(req.url, req.method);
    next();
  }
}
