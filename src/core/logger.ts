import { createLogger as createWinstonLogger, Logger, transports } from 'winston';

/**
 * Create logger. This implementation return "winston" logger.
 * @param name Logger name which is also name of logger file.
 * @returns Logger instance.
 */
export function createLogger(name: string): Logger {
  return createWinstonLogger({
    transports: [new transports.Console(), new transports.File({ filename: `${name}.log` })],
  });
}
