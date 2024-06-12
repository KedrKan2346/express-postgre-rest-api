import { StatusCodes } from 'http-status-codes';

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

export function formatErrorResponse(status: number, messages: string[]) {
  return {
    error: {
      status,
      messages,
    },
  };
}
