import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { formatErrorResponse } from '@core/format-response';
import { tryGetNumericValue } from '@core/utils';

function handleValidationError(error: any, res: Response) {
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue: any) => {
      const issuePath = issue.path.join('.');
      return issuePath ? `${issuePath}: ${issue.message}` : issue.message;
    });
    res.status(StatusCodes.BAD_REQUEST).json(formatErrorResponse(StatusCodes.BAD_REQUEST, errorMessages));
  } else {
    res.json(formatErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ['Unexpected server error.']));
  }
}

export function createParamIdPathSchema(idParameterName: string) {
  return z.object({
    [idParameterName]: z.string().uuid(),
  });
}

export const pageQueryParamsSchema = z.object({
  take: z
    .string()
    .optional()
    .refine(
      (data) => {
        if (!data) {
          return true;
        }
        const take = tryGetNumericValue(data);
        return take <= 1000;
      },
      { message: 'Max value is 1000' }
    ),
});

export function createRequestBodyValidator(schema: z.ZodObject<any, any>) {
  return function validateRequestBody(req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      handleValidationError(error, res);
    }
  };
}

export function createPathParamsValidator(schema: z.ZodObject<any, any>) {
  return function validatePathParams(req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      handleValidationError(error, res);
    }
  };
}

export function createQueryParamsValidator(schema: z.ZodObject<any, any>) {
  return function validateQueryParams(req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      handleValidationError(error, res);
    }
  };
}
