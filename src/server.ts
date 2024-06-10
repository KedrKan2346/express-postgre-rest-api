import express, { Express } from 'express';
import { Logger } from 'winston';
import { ServiceConfiguration } from '@core/config';
import { Server } from 'http';

export function createServer(config: ServiceConfiguration, logger: Logger): Server {
  logger.info(`Starting [${config.serviceName}] server on port: [${config.apiServerPort}]`);

  const app = express();

  app.get('/', function (req, res) {
    res.send('Hello World');
  });

  const server = app.listen(process.env.API_SERVER_PORT);

  logger.info(
    `Started [${config.serviceName}] server on port: [${config.apiServerPort}], db name: [${config.dbName}], db user: [${config.dbUserName}]`
  );

  return server;
}
