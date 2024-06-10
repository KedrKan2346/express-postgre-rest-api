import express, { Express, Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { Server } from 'http';
import { ServiceConfiguration } from '@core/config';
import { initSprocketRouters } from '@features/sprocket/index';

export function createServer(config: ServiceConfiguration, logger: Logger, dataSource: DataSource): Server {
  const app = express();

  // Mount routes from features
  const router = Router();
  router.use(initSprocketRouters());

  // Add api version prefix
  app.use(`/${config.apiVersion}`, router);

  // Start server
  const server = app.listen(process.env.API_SERVER_PORT);

  logger.info(
    `Started [${config.serviceName}] server on port: [${config.apiServerPort}], db name: [${config.dbName}], db user: [${config.dbUserName}], api version: [${config.apiVersion}]`
  );

  return server;
}
