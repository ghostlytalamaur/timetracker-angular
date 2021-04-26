import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Collection, MongoClient, MongoClientOptions } from 'mongodb';
import { Nullable } from '@tt/utils';

const URI = process.env.TIMETRACKER_SERVER_MONGODB_URI || '';

@Injectable()
export class MongoService implements OnModuleDestroy {
  private readonly options: MongoClientOptions;
  private client: Nullable<MongoClient>;
  private connecting: Nullable<Promise<MongoClient>>;

  constructor(private readonly logger: Logger) {
    this.options = {
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 20000,
      logger: (message, state) => this.logger.log(message, 'MongoService'),
    };
  }

  public async getCollection<T>(name: string): Promise<Collection<T>> {
    const client = await this.getClient();
    const db = client.db('timetracker');

    return db.collection(name);
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Closing database connection', 'MongoService');
    await this.client?.close();
  }

  private async getClient(): Promise<MongoClient> {
    // If there is no client
    if (!this.client) {
      try {
        // and currently no connection in progress
        if (!this.connecting) {
          // try to connect to database
          this.logger.log('Attempt to connect to database...', 'MongoService');
          this.logger.log(
            `Database uri: ${process.env.TIMETRACKER_SERVER_MONGODB_URI}`,
            'MongoService',
          );
          this.connecting = MongoClient.connect(URI, this.options);
        }

        // wait until database is connected
        this.client = await this.connecting;
      } finally {
        this.connecting = undefined;
      }
    }

    return this.client;
  }
}
