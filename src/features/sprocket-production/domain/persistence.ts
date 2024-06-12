import { SprocketProductionDto } from './dto';

export interface SprocketProductionPersistence {
  getAllPaged: (take: number, skip: number) => Promise<SprocketProductionDto[]>;

  getAllPagedByFactoryId: (factoryId: string, take: number, skip: number) => Promise<SprocketProductionDto[]>;
}
