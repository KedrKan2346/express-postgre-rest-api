export function formatResultResponse(
  dto: Record<string, any> | null,
  entityName: string,
  operation: 'mutation' | 'query',
  options: {
    details: Record<string, string | number | boolean>;
  }
) {
  return {
    result: {
      [operation]: {
        details: options.details,
        entityName,
        ...(dto ? { [entityName]: dto } : {}),
      },
      status: 200,
    },
  };
}

export function formatErrorResponse(status: number, message: string) {
  return {
    error: {
      status,
      message,
    },
  };
}
