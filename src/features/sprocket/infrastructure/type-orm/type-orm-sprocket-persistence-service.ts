import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateOrUpdateSprocketRequestDto, SprocketDto } from '../../domain/dto';
import { SprocketPersistence } from '../../domain/persistence';
import { TypeOrmSprocketPersistence } from './type-orm-sprocket-persistence';

/**
 * TypeORM framework based persistence service.
 */
export class TypeOrmSprocketPersistenceService implements SprocketPersistence {
  private repository: Repository<TypeOrmSprocketPersistence>;

  /**
   * Constructor.
   * @param dataSource Initialized and connected to database TypeORM data source.
   * @param logger Service logger.
   */
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = this.dataSource.getRepository(TypeOrmSprocketPersistence);
  }

  /**
   * Get paginated sprockets from database.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprockets limited by "take" parameter.
   */
  async getAllPaged(take: number, skip: number): Promise<SprocketDto[]> {
    return this.repository.find({ take, skip });
  }

  /**
   * Create new sprocket in database.
   * @param dto Sprocket DTO.
   * @returns Plain object containing id, createdAt, and updatedAt fields.
   */
  async create(
    dto: CreateOrUpdateSprocketRequestDto
  ): Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>> {
    const newEntity = this.repository.create(dto);
    const insertedEntity = await this.repository.insert(newEntity);
    return insertedEntity.raw;
  }

  /**
   * Get sprocket by id from database.
   * @param id Sprocket id.
   * @returns Sprocket DTO or null.
   */
  async findById(id: string): Promise<SprocketDto | null> {
    return this.repository.findOneBy({ id });
  }

  /**
   * Update sprocket by id in database.
   * @param id Sprocket id.
   * @param dto Sprocket DTO.
   * @returns Number of affected records
   */
  async updateById(id: string, dto: CreateOrUpdateSprocketRequestDto): Promise<number> {
    const insertedEntity = await this.repository.update({ id }, dto);
    return insertedEntity.affected;
  }
}
