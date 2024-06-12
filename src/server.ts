import express, { Express, Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { Server } from 'http';
import { ServiceConfiguration } from '@core/config';
import { initSprocketRouters } from '@features/sprocket/index';

// TechDebt: Express does not handle async errors properly so we can apply this patch or implement global
// async higher order function runner and wrap all controllers. Adding this patch as temporary solution which
// can be removed when stable Express 5 is released.
import 'express-async-errors';

export function createServer(config: ServiceConfiguration, logger: Logger, dataSource: DataSource): Server {
  function handleError(err: Error, req, res, next) {
    logger.info(JSON.stringify(err));

    if (err.name === 'ValidationError') {
      res.status(400);
      res.json({ error: err.message, status: 400 });
    } else if (err.name === 'NotFoundError') {
      res.status(404);
      res.json({ error: err.message, status: 404 });
    } else {
      logger.error('Unexpected server error: ', err);
      res.status(500);
      res.json({ error: 'Unexpected server error.', status: 500 });
    }

    next(err);
  }

  const app = express();

  app.use(express.json());

  // Mount routes from features
  const router = Router();
  router.use(initSprocketRouters(dataSource, logger));

  // Add api version prefix
  app.use(`/${config.apiVersion}`, router);

  app.use(handleError);

  // Start server
  const server = app.listen(process.env.API_SERVER_PORT);

  logger.info(
    `Started [${config.serviceName}] server on port: [${config.apiServerPort}], db name: [${config.dbName}], db user: [${config.dbUserName}], api version: [${config.apiVersion}]`
  );

  return server;
}
