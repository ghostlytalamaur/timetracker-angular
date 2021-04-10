/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app/app.module';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: true
  });
  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
    }),
  );
  const port = process.env.TIMETRACKER_SERVER_PORT || 3000;
  await app.listen(port, () => {
    Logger.log('Listening at http://localhost:' + port + '/');
    Logger.log('Environment');
    Logger.log(JSON.stringify(process.env, undefined, 4));
  });
}

bootstrap();
