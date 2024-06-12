import { Logger } from 'winston';
import { SprocketProductionDto } from './dto';
import { SprocketProductionPersistence } from './persistence';

export class SprocketProductionUseCases {
  constructor(
    private readonly persistenceService: SprocketProductionPersistence,
    private readonly logger: Logger
  ) {}

  async getAllPaged(take: number, skip: number): Promise<SprocketProductionDto[]> {
    return this.persistenceService.getAllPaged(take, skip);
  }

  async getAllPagedByFactoryId(
    factoryId: string,
    take: number,
    skip: number
  ): Promise<SprocketProductionDto[]> {
    return this.persistenceService.getAllPagedByFactoryId(factoryId, take, skip);
  }
}
