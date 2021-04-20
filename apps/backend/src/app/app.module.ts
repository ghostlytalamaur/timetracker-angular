import { Logger, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongoService } from './mongo.service';
import { SessionsController } from './sessions.controller';
import { AuthModule } from './auth/auth.module';
import { TagsController } from './tags.controller';
import { SessionsService } from './sessions.service';
import { TagsService } from './tags.service';
import { ImportController } from './import.controller';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './logger.interceptor';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    SessionsController,
    EventsController,
    TagsController,
    ImportController,
  ],
  providers: [
    MongoService,
    EventsService,
    SessionsService,
    TagsService,
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
  ],
})
export class AppModule {}
