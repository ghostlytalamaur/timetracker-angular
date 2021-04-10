import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';

const URI = process.env.TIMETRACKER_SERVER_MONGODB_URI || '';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {

  readonly client: MongoClient;

  constructor(
    private readonly logger: Logger,
  ) {
    this.client = new MongoClient(URI, {
      useUnifiedTopology: true,
    });
  }

  async onModuleInit(): Promise<void> {
    console.log('Connect to database');
    try {
        await this.client.connect();
    } catch (e) {
      this.logger.error(e);
    }
  }

  async onModuleDestroy(): Promise<void> {
    console.log('Disconnect from database');
    await this.client.close();
  }
}
