import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';
import { SprocketProductionDto } from '../../domain/dto';
import { SprocketProductionPersistence } from '../../domain/persistence';
import { TypeOrmSprocketProductionPersistence } from './type-orm-sprocket-production-persistence';

/**
 * TypeORM framework based persistence service.
 */
export class TypeOrmSprocketProductionPersistenceService implements SprocketProductionPersistence {
  private repository: Repository<TypeOrmSprocketProductionPersistence>;

  /**
   * Constructor.
   * @param dataSource Initialized and connected to database TypeORM data source.
   * @param logger Service logger.
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = this.dataSource.getRepository(TypeOrmSprocketProductionPersistence);
  }

  /**
   * Get paginated sprocket production data from database.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprocket production data limited by "take" parameter.
   */
  async getAllPaged(take: number, skip: number): Promise<SprocketProductionDto[]> {
    return this.repository.find({ take, skip });
  }

  /**
   * Get paginated sprocket production data filtered by factory id from database.
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
    return this.repository.find({
      take,
      skip,
      where: {
        factoryId,
      },
    });
  }
}
