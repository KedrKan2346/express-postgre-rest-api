import { tryGetNumericValue } from './utils';

/**
 * Get required process env value and throws exception if value does not exist.
 * @param envParamName Env parameter name.
 * @returns Env parameter value.
 */
function getEnvValueOrThrow(envParamName: string): string {
  const envValue = process.env[envParamName];

  if (!envValue) {
    throw new Error(`[${envParamName}] is required but not defined.`);
  }

  return envValue;
}

/**
 * Get process env value which may not exist.
 * @param envParamName Env parameter name.
 * @returns Env parameter value.
 */
function getEnvValue(envParamName: string): string {
  return process.env[envParamName];
}

/**
 * Declaration of service parameters which are passed via process env variables.
 */
export interface ServiceConfiguration {
  dbHost: string;
  dbName: string;
  dbUserName: string;
  dbUserPassword: string;
  dbPort?: number;
  apiVersion: string;
  apiServerPort: string;
  serviceName: string;
}

/**
 * Get service parameters which are passed via process env variables.
 * @returns Service parameters which are passed via process env variables.
 */
export function getServiceConfiguration(): ServiceConfiguration {
  return {
    dbHost: getEnvValue('DB_HOST'),
    apiServerPort: getEnvValueOrThrow('API_SERVER_PORT'),
    apiVersion: getEnvValueOrThrow('API_VERSION'),
    dbName: getEnvValueOrThrow('DB_NAME'),
    dbUserName: getEnvValueOrThrow('DB_USER_NAME'),
    dbUserPassword: getEnvValueOrThrow('DB_USER_PASSWORD'),
    dbPort: tryGetNumericValue(getEnvValueOrThrow('DB_PORT')),
    serviceName: getEnvValueOrThrow('SERVICE_NAME'),
  };
}
