import { Logger } from 'winston';
import { SprocketDto } from './dto';
import { ValidationError } from '@core/errors';

/**
 * Sprocket domain model which contains business logic.
 */
export class SprocketDomainEntity {
  constructor(
    private readonly dto: SprocketDto,
    private readonly logger: Logger
  ) {}

  validateDiameters(): boolean {
    if (this.dto.pitchDiameter > this.dto.outsideDiameter) {
      throw new ValidationError('Outside diameter should be greater than pitch diameter');
    }

    return true;
  }

  toDto(): SprocketDto {
    return this.dto;
  }
}
