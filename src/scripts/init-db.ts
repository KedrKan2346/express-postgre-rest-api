import { getServiceConfiguration } from '@core/config';
import { createPgPool } from '@core/postgres-client';
import { createLogger } from '@core/logger';
import { createDnSchema } from '@migrations/1718027120-create-db-schema';

const logger = createLogger('migrations');

/**
 * NOTE: In real production project we want to implement migration engine which has migrations
 * log table with last migration timestamp. The migration logic could read files from the migrations folder,
 * sort by name, and execute only the latest non executed scripts. File names of the migration scripts start with epoch
 * timestamp.
 */

(async () => {
  try {
    const config = getServiceConfiguration();
    const pgPool = createPgPool(config);
    await createDnSchema(pgPool, logger);
  } catch (e) {
    logger.error('Init db migration failed with error: ', e);
  }
})();
