import { Request } from 'express';
import { tryGetNumericValue } from '@core/utils';

/**
 * Safely extract and cast to number paging related query params such as "take" and "skip".
 * @param req HTTP request.
 * @returns "take" and "skip" paging params.
 */
export function getPageQueryParams(req: Request): { take: number; skip: number } {
  // Returns 50 production data by default.
  const take = tryGetNumericValue(req.query.take) ?? 50;
  // Returns the first page by default.
  const skip = tryGetNumericValue(req.query.skip) ?? 0;

  return { take, skip };
}
