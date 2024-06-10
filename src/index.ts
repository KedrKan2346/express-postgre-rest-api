import { DataSource } from 'typeorm';
import { Server } from 'http';
import { createServer } from './server';
import { createLogger } from '@core/logger';
import { getServiceConfiguration } from '@core/config';
import { PersistenceClient } from '@core/persistence-client';

let server: Server | null = null;
let dataSource: DataSource | null = null;
const config = getServiceConfiguration();
const serviceName = config.serviceName;
const serviceLogger = createLogger(`${serviceName}-service`);

serviceLogger.info(`Starting [${config.serviceName}] server on port: [${config.apiServerPort}]`);

const persistenceClient = new PersistenceClient(
  {
    dbHost: config.dbHost,
    dbName: config.dbName,
    dbPort: config.dbPort,
    dbUserName: config.dbUserName,
    dbUserPassword: config.dbUserPassword,
  },
  serviceLogger
);

persistenceClient
  .initializeDataSource()
  .then((initializedDataSource) => {
    dataSource = initializedDataSource;
    serviceLogger.info(`Data source for [${config.serviceName}] service initialized.`);
    server = createServer(config, serviceLogger, dataSource);
  })
  .catch((err) => {
    serviceLogger.error(`Data source initialization for [${config.serviceName}] service failed.`);
  });

process.on('unhandledRejection', (e) => {
  serviceLogger.error(`Unhandled promise rejection in [${config.serviceName}] service.`, e);
});

process.on('uncaughtException', (e) => {
  serviceLogger.error(`Uncaught exception in [${config.serviceName}] service.`, e);
});

function handleTerminationSignal(signal: string) {
  console.log(`Received [${signal}] signal.`);

  handleGracefulShutdown();
}

function handleGracefulShutdown() {
  if (!server) {
    return;
  }

  server.close(async function onServerClosed(e) {
    serviceLogger.info(`Terminate [${config.serviceName}] service.`);

    await persistenceClient.destroyDataSource(dataSource);
    dataSource = null;

    if (e) {
      serviceLogger.error(
        `Service [${config.serviceName}] termination failed. Force process exit. Error:`,
        e
      );
      process.exit(1);
    }
    serviceLogger.info(`Terminated [${config.serviceName}] service.`);
    process.exit(0);
  });
}

// setup termination handlers for a list of signals
const signals = [
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGHUP',
  'SIGILL',
  'SIGINT',
  'SIGQUIT',
  'SIGSEGV',
  'SIGTERM',
  'SIGTRAP',
  'SIGUSR1',
  'SIGUSR2',
];

for (const signal of signals) {
  process.on(signal, handleTerminationSignal);
}
