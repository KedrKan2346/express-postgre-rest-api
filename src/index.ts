import { createServer } from './server';
import { createLogger } from '@core/logger';
import { getServiceConfiguration } from '@core/config';

const config = getServiceConfiguration();
const serviceName = config.serviceName;
const serviceLogger = createLogger(`${serviceName}-service`);
const server = createServer(config, serviceLogger);

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
  server.close(function onServerClosed(e) {
    serviceLogger.info(`Terminate [${config.serviceName}] service.`);

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
