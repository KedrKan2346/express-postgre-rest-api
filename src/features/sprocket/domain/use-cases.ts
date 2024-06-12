import { DataSource } from 'typeorm';
import { Logger } from 'winston';
import { CreateOrUpdateSprocketRequestDto, SprocketDto } from './dto';
import { SprocketPersistence } from './persistence';
import { SprocketDomainEntity } from './sprocket-domain-entity';

export class SprocketUseCases {
  constructor(
    private readonly persistenceService: SprocketPersistence,
    private readonly logger: Logger
  ) {}

  async getAllPaged(): Promise<SprocketDto[]> {
    return this.persistenceService.getAllPaged();
  }

  async create(
    dto: CreateOrUpdateSprocketRequestDto
  ): Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>> {
    const domainEntity = new SprocketDomainEntity(dto, this.logger);

    // Using domain model in use case
    domainEntity.validateDiameters();

    return this.persistenceService.create(domainEntity.toDto());
  }

  async findById(id: string): Promise<SprocketDto | null> {
    return this.persistenceService.findById(id);
  }

  async updateById(id: string, dto: CreateOrUpdateSprocketRequestDto): Promise<number> {
    return this.persistenceService.updateById(id, dto);
  }
}
