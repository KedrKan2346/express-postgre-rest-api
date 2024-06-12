import { DataSource, Repository } from 'typeorm';
import { Logger } from 'winston';
import { SprocketProductionDto } from '../../domain/dto';
import { SprocketProductionPersistence } from '../../domain/persistence';
import { TypeOrmSprocketProductionPersistence } from './type-orm-sprocket-production-persistence';

export class TypeOrmSprocketProductionPersistenceService implements SprocketProductionPersistence {
  private repository: Repository<TypeOrmSprocketProductionPersistence>;

  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: Logger
  ) {
    this.repository = this.dataSource.getRepository(TypeOrmSprocketProductionPersistence);
  }

  async getAllPaged(take: number, skip: number): Promise<SprocketProductionDto[]> {
    return this.repository.find({ take, skip });
  }

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
