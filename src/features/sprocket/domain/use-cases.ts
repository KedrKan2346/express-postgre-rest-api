import { Logger } from 'winston';
import { CreateOrUpdateSprocketRequestDto, SprocketDto } from './dto';
import { SprocketPersistence } from './persistence';
import { SprocketDomainEntity } from './sprocket-domain-entity';

/**
 * Use cases implement bridge between HTTP requests (routes, controllers), persistence,
 * and domain model and should be frameworks and libs agnostic.
 */
export class SprocketUseCases {
  constructor(
    private readonly persistenceService: SprocketPersistence,
    private readonly logger: Logger
  ) {}

  /**
   * Get paginated sprockets.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprockets limited by "take" parameter.
   */
  async getAllPaged(take: number, skip: number): Promise<SprocketDto[]> {
    return this.persistenceService.getAllPaged(take, skip);
  }

  /**
   * Create new sprocket.
   * @param dto Sprocket DTO.
   * @returns Plain object containing id, createdAt, and updatedAt fields.
   */
  async create(
    dto: CreateOrUpdateSprocketRequestDto
  ): Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>> {
    const domainEntity = new SprocketDomainEntity(dto, this.logger);

    // Using domain model in use case
    domainEntity.validateDiameters();

    return this.persistenceService.create(domainEntity.toDto());
  }

  /**
   * Get sprocket by id.
   * @param id Sprocket id.
   * @returns Sprocket DTO or null.
   */
  async findById(id: string): Promise<SprocketDto | null> {
    return this.persistenceService.findById(id);
  }

  /**
   * Update sprocket by id.
   * @param id Sprocket id.
   * @param dto Sprocket DTO.
   * @returns Number of affected records
   */
  async updateById(id: string, dto: CreateOrUpdateSprocketRequestDto): Promise<number> {
    return this.persistenceService.updateById(id, dto);
  }
}
