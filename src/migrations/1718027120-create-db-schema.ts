import { Pool } from 'pg';
import { Logger } from 'winston';

async function createSprocketProductionSnapshotTable(pgPool: Pool, logger: Logger): Promise<void> {
  const tableName = 'sprocket_production_snapshot';
  const tableFactoryIdIndexName = 'idx_sprocket_production_snapshot_factory_id';
  logger.info('Connecting to database...');
  let poolClient = null;

  try {
    const poolClient = await pgPool.connect();

    logger.info(`Creating ${tableName} table...`);

    await poolClient.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
          factory_id uuid NOT NULL,
          goal int NOT NULL,
          actual int NOT NULL,
          created_at timestamp NOT NULL DEFAULT NOW()
        );
        CREATE INDEX IF NOT EXISTS ${tableFactoryIdIndexName} ON ${tableName} (factory_id);`);
    logger.info(`${tableName} table created`);
  } catch (error) {
    logger.error(`Failed to create ${tableName} table: ${error}`);
  } finally {
    logger.info('Releasing database client...');
    try {
      if (poolClient) {
        poolClient.release();
      }
      logger.info('Database client released');
    } catch (error) {
      logger.error('Unable to release database client: ' + error);
    }
  }
}

async function createSprocketTable(pgPool: Pool, logger: Logger): Promise<void> {
  const tableName = 'sprocket';
  const tableIndexName = 'idx_sprocket_id';
  const tableFactoryIdIndexName = 'idx_sprocket_factory_id';
  logger.info('Connecting to database...');
  let poolClient = null;

  try {
    const poolClient = await pgPool.connect();

    logger.info(`Creating ${tableName} table...`);

    await poolClient.query(`
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id uuid NOT NULL DEFAULT uuid_generate_v4(),
            factory_id uuid NOT NULL,
            teeth smallint NOT NULL,
            pitch_diameter smallint NOT NULL,
            outside_diameter smallint NOT NULL,
            pitch smallint NOT NULL,
            created_at timestamp NOT NULL DEFAULT NOW(),
            updated_at timestamp NOT NULL DEFAULT NOW(),
            PRIMARY KEY (id, factory_id)
          );
          CREATE INDEX IF NOT EXISTS ${tableIndexName} ON ${tableName} (id);
          CREATE INDEX IF NOT EXISTS ${tableFactoryIdIndexName} ON ${tableName} (factory_id);`);
    logger.info(`${tableName} table created`);
  } catch (error) {
    logger.error(`Failed to create ${tableName} table: ${error}`);
  } finally {
    logger.info('Releasing database client...');
    try {
      if (poolClient) {
        poolClient.release();
      }
      logger.info('Database client released');
    } catch (error) {
      logger.error('Unable to release database client: ' + error);
    }
  }
}

async function createFactoryTable(pgPool: Pool, logger: Logger): Promise<void> {
  const tableName = 'factory';
  const tableFIndexName = 'idx_factory_id';
  logger.info('Connecting to database...');
  let poolClient = null;

  try {
    const poolClient = await pgPool.connect();

    logger.info(`Creating ${tableName} table...`);

    await poolClient.query(`
          CREATE TABLE IF NOT EXISTS ${tableName} (
            id uuid NOT NULL,
            name varchar(203) NOT NULL,
            created_at timestamp NOT NULL DEFAULT NOW(),
            updated_at timestamp NOT NULL DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS ${tableFIndexName} ON ${tableName} (id);`);
    logger.info(`${tableName} table created`);
  } catch (error) {
    logger.error(`Failed to create ${tableName} table: ${error}`);
  } finally {
    logger.info('Releasing database client...');
    try {
      if (poolClient) {
        poolClient.release();
      }
      logger.info('Database client released');
    } catch (error) {
      logger.error('Unable to release database client: ' + error);
    }
  }
}

export async function createDnSchema(pgPool: Pool, logger: Logger) {
  await createSprocketProductionSnapshotTable(pgPool, logger);
  await createSprocketTable(pgPool, logger);
  await createFactoryTable(pgPool, logger);
}
