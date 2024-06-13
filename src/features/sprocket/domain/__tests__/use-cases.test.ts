import { ValidationError } from '@core/errors';
import { createLogger } from 'winston';
import { mock } from 'jest-mock-extended';
import { SprocketDomainEntity } from '../sprocket-domain-entity';
import { TypeOrmSprocketPersistenceService } from '../../infrastructure';
import { SprocketUseCases } from '../use-cases';

const sprocketsResponse = [
  {
    id: '66a2e56d-6311-4fa3-b088-c33a5d69fc69',
    factoryId: '1cfaaac5-64fb-428c-9e29-2580d0815397',
    teeth: 51,
    pitchDiameter: 151,
    outsideDiameter: 170,
    pitch: 140,
  },
];

const defaultSprocketDto = {
  factoryId: '1cfaaac5-64fb-428c-9e29-2580d0815397',
  teeth: 51,
  pitchDiameter: 151,
  outsideDiameter: 170,
  pitch: 111,
};

const mockLogger = createLogger();

const mockPersistence = mock<TypeOrmSprocketPersistenceService>({
  getAllPaged: jest.fn(async () => sprocketsResponse),
  create: jest.fn(async () => {
    return { id: '66a2e56d-6311-4fa3-b088-c33a5d69fc69' };
  }),
  findById: jest.fn(async () => sprocketsResponse[0]),
  updateById: jest.fn(async () => 1),
});

beforeEach(() => {
  mockPersistence.getAllPaged.mockClear();
  mockPersistence.create.mockClear();
  mockPersistence.findById.mockClear();
  mockPersistence.updateById.mockClear();
});

// NOTE: The best practice is having tests free of implementation details so DTO fields
// which come from persistence will not be explored. Only non mocked domain model interactions
// are important.

describe('Sprocket use case should', () => {
  it('persist new sprocket if domain model is valid', async () => {
    const useCases = new SprocketUseCases(mockPersistence, mockLogger);
    const newSprocket = await useCases.create(defaultSprocketDto);
    expect(newSprocket).toEqual({ id: '66a2e56d-6311-4fa3-b088-c33a5d69fc69' });
    expect(mockPersistence.create).toHaveBeenCalledTimes(1);
    expect(mockPersistence.create).toHaveBeenCalledWith(defaultSprocketDto);
  });

  it('throw validation error if domain model is not valid', async () => {
    const useCases = new SprocketUseCases(mockPersistence, mockLogger);
    const sprocketDto = { ...defaultSprocketDto, outsideDiameter: 17 };
    try {
      await useCases.create(sprocketDto);
    } catch (e) {
      expect(e).toBeInstanceOf(ValidationError);
    }
    expect(mockPersistence.create).toHaveBeenCalledTimes(0);
  });

  it('return paged sprockets', async () => {
    const useCases = new SprocketUseCases(mockPersistence, mockLogger);
    const sprockets = await useCases.getAllPaged(10, 1);
    expect(mockPersistence.getAllPaged).toHaveBeenCalledTimes(1);
    expect(mockPersistence.getAllPaged).toHaveBeenCalledWith(10, 1);
    expect(sprockets).toEqual(sprocketsResponse);
  });

  it('update sprocket by id', async () => {
    const useCases = new SprocketUseCases(mockPersistence, mockLogger);
    const sprocketDto = { ...defaultSprocketDto, teeth: 1, pitch: 1 };
    const result = await useCases.updateById('66a2e56d-6311-4fa3-b088-c33a5d69fc69', sprocketDto);
    expect(mockPersistence.updateById).toHaveBeenCalledTimes(1);
    expect(mockPersistence.updateById).toHaveBeenCalledWith(
      '66a2e56d-6311-4fa3-b088-c33a5d69fc69',
      sprocketDto
    );
    expect(result).toBe(1);
  });

  it('return sprocket by id', async () => {
    const useCases = new SprocketUseCases(mockPersistence, mockLogger);
    const sprocket = await useCases.findById('66a2e56d-6311-4fa3-b088-c33a5d69fc69');
    expect(mockPersistence.findById).toHaveBeenCalledTimes(1);
    expect(mockPersistence.findById).toHaveBeenCalledWith('66a2e56d-6311-4fa3-b088-c33a5d69fc69');
    expect(sprocket).toEqual(sprocketsResponse[0]);
  });
});
