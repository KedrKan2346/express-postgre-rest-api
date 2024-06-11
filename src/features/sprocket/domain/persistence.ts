import { CreateOrUpdateSprocketRequestDto, SprocketDto } from './dto';

export interface SprocketPersistence {
  getAllPaged: () => Promise<SprocketDto[]>;

  create: (
    dto: CreateOrUpdateSprocketRequestDto
  ) => Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>>;

  findById: (id: string) => Promise<SprocketDto>;

  updateById: (id: string, dto: CreateOrUpdateSprocketRequestDto) => Promise<number>;
}
