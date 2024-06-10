import { Pool } from 'pg';
import { ServiceConfiguration } from './config';

export function createPgPool(config: ServiceConfiguration): Pool {
  return new Pool({
    host: config.dbHost,
    database: config.dbName,
    user: config.dbUserName,
    password: config.dbUserPassword,
  });
}
