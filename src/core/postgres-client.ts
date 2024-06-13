import { Pool } from 'pg';
import { ServiceConfiguration } from './config';

/**
 * Create PostgreSQL connection pool. This is utility method to be used for DB migration scripts in generally.
 * @param config Service configuration env values.
 * @returns PostgreSQL connection pool.
 */
export function createPgPool(config: ServiceConfiguration): Pool {
  return new Pool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUserName,
    password: config.dbUserPassword,
  });
}
