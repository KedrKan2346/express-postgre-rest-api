import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';
import { CreateOrUpdateSprocketRequestDto, SprocketDto } from '../../domain/dto';
import { SprocketPersistence } from '../../domain/persistence';
import { TypeOrmSprocketPersistence } from './type-orm-sprocket-persistence';

export class TypeOrmSprocketPersistenceService implements SprocketPersistence {
  private repository: Repository<TypeOrmSprocketPersistence>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = this.dataSource.getRepository(TypeOrmSprocketPersistence);
  }

  async getAllPaged(): Promise<SprocketDto[]> {
    return this.repository.find();
  }

  async create(
    dto: CreateOrUpdateSprocketRequestDto
  ): Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>> {
    const newEntity = this.repository.create(dto);
    const insertedEntity = await this.repository.insert(newEntity);
    return insertedEntity.raw;
  }

  async findById(id: string): Promise<SprocketDto> {
    return this.repository.findOneBy({ id });
  }

  async updateById(id: string, dto: CreateOrUpdateSprocketRequestDto): Promise<number> {
    const insertedEntity = await this.repository.update({ id }, dto);
    return insertedEntity.affected;
  }
}
