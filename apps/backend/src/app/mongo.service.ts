import { HttpException, HttpStatus, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import { Nullable } from '@tt/core/util';

const URI = process.env.TIMETRACKER_SERVER_MONGODB_URI || '';

@Injectable()
export class MongoService implements OnModuleDestroy {
  private readonly options: MongoClientOptions;
  private client: Nullable<MongoClient>;

  constructor(private readonly logger: Logger) {
    this.options = {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
      logger: (message, state) => this.logger.log(state, message),
    };
  }

  public async getCollection<T>(name: string): Promise<Collection<T>> {
    const client = await this.getClient();
    const db = client.db('timetracker');

    return db.collection(name);
  }

  async onModuleDestroy(): Promise<void> {
    console.log('Closing database connection');
    await this.client?.close();
  }

  private async getClient(): Promise<MongoClient> {
    if (!this.client) {
      Logger.log('Attempt to connect to database...');
      Logger.log(process.env.TIMETRACKER_SERVER_MONGODB_URI, 'Database uri:');
      this.client = await MongoClient.connect(URI, this.options);
    }

    return this.client;
  }
}
