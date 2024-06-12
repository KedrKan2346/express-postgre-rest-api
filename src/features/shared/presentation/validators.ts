import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { formatErrorResponse } from '@core/format-response';

function handleValidationError(error: any, res: Response) {
  if (error instanceof ZodError) {
    const errorMessages = error.errors.map((issue: any) => `${issue.path.join('.')} is ${issue.message}`);
    res.status(StatusCodes.BAD_REQUEST).json(formatErrorResponse(StatusCodes.BAD_REQUEST, errorMessages));
  } else {
    res.json(formatErrorResponse(StatusCodes.INTERNAL_SERVER_ERROR, ['Unexpected server error.']));
  }
}

export const paramIdPathSchema = z.object({
  id: z.string().uuid(),
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

export function createParamsValidator(schema: z.ZodObject<any, any>) {
  return function validateRequestBody(req: Request, res: Response, next: NextFunction) {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      handleValidationError(error, res);
    }
  };
}
