import { Logger } from 'winston';
import { SprocketProductionDto } from './dto';
import { SprocketProductionPersistence } from './persistence';

/**
 * Use cases implement bridge between HTTP requests (routes, controllers), persistence,
 * and domain model and should be frameworks and libs agnostic.
 */
export class SprocketProductionUseCases {
  constructor(
    private readonly persistenceService: SprocketProductionPersistence,
    private readonly logger: Logger
  ) {}

  /**
   * Get paginated sprocket production data.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprocket production data limited by "take" parameter.
   */
  async getAllPaged(take: number, skip: number): Promise<SprocketProductionDto[]> {
    return this.persistenceService.getAllPaged(take, skip);
  }

  /**
   * Get paginated sprocket production data filtered by factory id.
   * @param factoryId Factory id.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns Factory sprocket production data limited by "take" parameter.
   */
  async getAllPagedByFactoryId(
    factoryId: string,
    take: number,
    skip: number
  ): Promise<SprocketProductionDto[]> {
    return this.persistenceService.getAllPagedByFactoryId(factoryId, take, skip);
  }
}
