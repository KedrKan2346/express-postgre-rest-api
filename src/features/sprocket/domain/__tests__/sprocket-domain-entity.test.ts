import { ValidationError } from '@core/errors';
import { SprocketDomainEntity } from '../sprocket-domain-entity';
import { createLogger } from 'winston';

const defaultSprocketDto = {
  factoryId: '1cfaaac5-64fb-428c-9e29-2580d0815397',
  teeth: 51,
  pitchDiameter: 151,
  outsideDiameter: 170,
  pitch: 111,
};

const mockLogger = createLogger();

describe('Sprocket domain entity should', () => {
  it('pass validation if "pitchDiameter" is less or equal "outsideDiameter"', () => {
    const sprocketDomain = new SprocketDomainEntity(defaultSprocketDto, mockLogger);
    expect(sprocketDomain.validateDiameters()).toEqual(true);
  });

  it('throw error if "outsideDiameter" is less than "pitchDiameter"', () => {
    const sprocketDto = { ...defaultSprocketDto, outsideDiameter: 17 };
    const sprocketDomain = new SprocketDomainEntity(sprocketDto, mockLogger);
    expect(() => {
      sprocketDomain.validateDiameters();
    }).toThrow(ValidationError);
  });

  it('return internal state as DTO', () => {
    const sprocketDomain = new SprocketDomainEntity(defaultSprocketDto, mockLogger);
    expect(sprocketDomain.toDto()).toEqual(defaultSprocketDto);
  });
});
