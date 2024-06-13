import { z } from 'zod';

// 2 bytes smallint analog.
const MAX_SMALL_INT_VALUE = 32767;

/**
 * Sprocket's PUT and POST HTTP request body validation schema.
 */
export const sprocketCreateOrUpdateDtoSchema = z.object({
  factoryId: z.string().uuid(),
  teeth: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  pitchDiameter: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  outsideDiameter: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  pitch: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
});
