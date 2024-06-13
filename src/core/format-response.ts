import { StatusCodes } from 'http-status-codes';

/**
 * Format successful HTTP result response with status code 200 (ok). Use this formatter to maintain unified response structure.
 * @param dto Response payload.
 * @param entityName Entity name which is kay name in response object.
 * @param operation Indicate what operation (mutation | query) was performed.
 * @param options Free form of additional information to be included in response.
 * @returns Successful HTTP result response object.
 */
export function formatResultResponse(
  dto: Record<string, any> | null,
  entityName: string,
  operation: 'mutation' | 'query',
  options: {
    details: Record<string, any>;
  }
) {
  return {
    result: {
      [operation]: {
        details: options.details,
        entityName,
        ...(dto ? { [entityName]: dto } : {}),
      },
      status: StatusCodes.OK,
    },
  };
}

/**
 * Format unsuccessful HTTP error response with status code 400 or greater. Use this formatter to maintain unified response structure.
 * @param status HTTP status code.
 * @param messages Array of string error messages.
 * @returns Unsuccessful HTTP error response object.
 */
export function formatErrorResponse(status: number, messages: string[]) {
  return {
    error: {
      status,
      messages,
    },
  };
}
