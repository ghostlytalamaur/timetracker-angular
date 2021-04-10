import { Logger, Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { MongoService } from './mongo.service';
import { SessionsController } from './sessions.controller';
import { AuthModule } from './auth/auth.module';
import { TagsController } from './tags.controller';
import { SessionsService } from './sessions.service';
import { TagsService } from './tags.service';

@Module({
  imports: [
    AuthModule,
  ],
  controllers: [
    SessionsController,
    EventsController,
    TagsController,
  ],
  providers: [
    MongoService,
    EventsService,
    SessionsService,
    TagsService,
    Logger,
  ],
})
export class AppModule {}
