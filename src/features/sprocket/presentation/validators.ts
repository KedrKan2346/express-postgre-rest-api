import { z } from 'zod';

const MAX_SMALL_INT_VALUE = 32767;

export const sprocketCreateOrUpdateDtoSchema = z.object({
  factoryId: z.string().uuid(),
  teeth: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  pitchDiameter: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  outsideDiameter: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
  pitch: z.number().int().positive().max(MAX_SMALL_INT_VALUE),
});
