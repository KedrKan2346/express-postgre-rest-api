import { Pool } from 'pg';
import { Logger } from 'winston';
import sprocketProductionJson from './seed/seed_factory_data.json';

/**
 * This script creates database schema and loads sprocket production data.
 */

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
          collected_at timestamp NOT NULL,
          created_at timestamp NOT NULL DEFAULT NOW(),
          updated_at timestamp NOT NULL DEFAULT NOW()
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

async function loadProductionDataOnce(pgPool: Pool, logger: Logger): Promise<void> {
  const factoryIds = [
    '1cfaaac5-64fb-428c-9e29-2580d0815397',
    '1cfaaac5-64fb-428c-9e29-2580d0815398',
    '1cfaaac5-64fb-428c-9e29-2580d0815399',
  ];
  logger.info('Connecting to database...');
  let poolClient = null;

  try {
    const poolClient = await pgPool.connect();
    const productionCountResult = await poolClient.query(
      'SELECT COUNT(*) FROM sprocket_production_snapshot;'
    );
    const productionCount = productionCountResult.rows[0].count;

    if (productionCount === '0') {
      logger.info(`Load sprocket production data started.`);

      const { factories } = sprocketProductionJson;

      for (let factoryIdx = 0; factoryIdx < factories.length; factoryIdx++) {
        const factoryDataSet = factories[factoryIdx].factory.chart_data;
        const factoryId = factoryIds[factoryIdx];
        const {
          sprocket_production_actual: actualDataSet,
          sprocket_production_goal: goalDataSet,
          time: timestampsDataSet,
        } = factoryDataSet;

        if (actualDataSet.length !== goalDataSet.length || goalDataSet.length !== timestampsDataSet.length) {
          throw new Error(`Inconsistent data set for position [${factoryIdx}]`);
        }

        const dataSetCount = actualDataSet.length;

        for (let factoryDataSetIdx = 0; factoryDataSetIdx < dataSetCount; factoryDataSetIdx++) {
          const goal = goalDataSet[factoryDataSetIdx];
          const actual = actualDataSet[factoryDataSetIdx];
          const collectedAt = new Date(timestampsDataSet[factoryDataSetIdx] * 1000);

          await poolClient.query({
            text: `
            INSERT INTO sprocket_production_snapshot
            VALUES ($1, $2, $3, $4)
            `,
            values: [factoryId, goal, actual, collectedAt],
          });
        }
      }

      logger.info(`Load sprocket production data completed.`);
    } else {
      logger.info(`Sprocket production data already exists. Operation skipped.`);
    }
  } catch (error) {
    logger.error(`Failed load sprocket production data: ${error}`);
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

  await loadProductionDataOnce(pgPool, logger);
}
