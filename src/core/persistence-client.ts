import { DataSource } from 'typeorm';
import { Logger } from 'winston';

interface PersistenceClientConfig {
  dbHost: string;
  dbName: string;
  dbUserName: string;
  dbUserPassword: string;
  dbPort: number;
}

export class PersistenceClient {
  constructor(
    private readonly config: PersistenceClientConfig,
    private readonly logger: Logger
  ) {}

  async initializeDataSource(): Promise<DataSource> {
    const dataSource = new DataSource({
      type: 'postgres',
      host: this.config.dbHost,
      username: this.config.dbUserName,
      password: this.config.dbUserPassword,
      database: this.config.dbName,
      port: this.config.dbPort,
    });
    return dataSource.initialize();
  }

  async destroyDataSource(dataSource: DataSource | null): Promise<void> {
    this.logger.info('Destroying data source.');

    if (dataSource && dataSource.isInitialized) {
      try {
        await dataSource.destroy();
        this.logger.info('Data source destroyed.');
      } catch (error) {
        this.logger.error(`Failed to destroy data source. Error: ${error}`);
      }
    } else {
      this.logger.info('Data source was not initialized. Destroy skipped.');
    }
  }
}
