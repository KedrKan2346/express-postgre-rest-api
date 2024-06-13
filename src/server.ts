import express, { Express, Router } from 'express';
import { Logger } from 'winston';
import { DataSource } from 'typeorm';
import { Server } from 'http';
import { StatusCodes } from 'http-status-codes';
import { ServiceConfiguration } from '@core/config';
import { formatErrorResponse } from '@core/format-response';
import { initSprocketRouters } from '@features/sprocket';
import { initSprocketProductionRouters } from '@features/sprocket-production';

// TechDebt: Express does not handle async errors properly so we can apply this patch or implement global
// async higher order function runner and wrap all controllers. Adding this patch as temporary solution which
// can be removed when stable Express 5 is released.
import 'express-async-errors';

/**
 * Create and start express server.
 * @param config Service parameters which are passed via process env variables.
 * @param logger Service logger.
 * @param dataSource TypeORM data source to be passed down to the routes. Data source is initialized at root level of the service
 * in order to close connections and destroy pool gracefully if server is stopped (graceful shutdown).
 * @returns Server running on a port defined in process env variable.
 */
export function createServer(config: ServiceConfiguration, logger: Logger, dataSource: DataSource): Server {
  function handleError(err: Error, req, res, next) {
    if (err.name === 'ValidationError') {
      res.status(StatusCodes.BAD_REQUEST);
      res.json(formatErrorResponse(StatusCodes.BAD_REQUEST, [err.message]));
    } else if (err.name === 'NotFoundError') {
      res.status(StatusCodes.NOT_FOUND);
      res.json(formatErrorResponse(StatusCodes.NOT_FOUND, [err.message]));
    } else {
      logger.error('Unexpected server error: ', err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR);
      res.json(formatErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ['Unexpected server error.']));
    }

    next(err);
  }

  const app = express();

  app.use(express.json());

  // Mount routes from features.
  const router = Router();
  router.use(initSprocketRouters(dataSource, logger));
  router.use(initSprocketProductionRouters(dataSource, logger));

  // Add api version prefix.
  app.use(`/${config.apiVersion}`, router);

  app.use(handleError);

  // Start server.
  const server = app.listen(process.env.API_SERVER_PORT);

  logger.info(
    `Started [${config.serviceName}] server on port: [${config.apiServerPort}], db name: [${config.dbName}], db user: [${config.dbUserName}], api version: [${config.apiVersion}]`
  );

  return server;
}
