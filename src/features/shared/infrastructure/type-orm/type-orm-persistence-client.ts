import { TypeOrmSprocketProductionPersistence } from '@features/sprocket-production/infrastructure';
import { TypeOrmSprocketPersistence } from '@features/sprocket/infrastructure';
import { DataSource } from 'typeorm';
import { Logger } from 'winston';

interface PersistenceClientConfig {
  dbHost: string;
  dbName: string;
  dbUserName: string;
  dbUserPassword: string;
  dbPort: number;
}

/**
 * TypeORM persistence client which initializes (connects to database) and destroys data source.
 */
export class TypeOrmPersistenceClient {
  constructor(
    private readonly config: PersistenceClientConfig,
    private readonly logger: Logger
  ) {}

  /**
   * Initialize data source and connect to database.
   * @returns Initialized data source.
   */
  async initializeDataSource(): Promise<DataSource> {
    const dataSource = new DataSource({
      type: 'postgres',
      host: this.config.dbHost,
      username: this.config.dbUserName,
      password: this.config.dbUserPassword,
      database: this.config.dbName,
      port: this.config.dbPort,
      // I do not know how to add entities later at feature/route level and follow "feature slicing" approach
      // by initializing feature at route level. Importing TypeOrm entity definition does not look perfect
      // but it is not super bad because this client class is also library specific infrastructure.
      // The entities array is required to extract metadata information. Otherwise getting "No Metadata found..." error.
      entities: [TypeOrmSprocketPersistence, TypeOrmSprocketProductionPersistence],
    });
    return dataSource.initialize();
  }

  /**
   * Disconnect from database, close connections, and release data source resources.
   * @param dataSource Data source to destroy.
   */
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
