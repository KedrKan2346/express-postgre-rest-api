import { createLogger as createWinstonLogger, Logger, transports } from 'winston';

export function createLogger(name: string): Logger {
  return createWinstonLogger({
    transports: [new transports.Console(), new transports.File({ filename: `${name}.log` })],
  });
}
