import { CreateOrUpdateSprocketRequestDto, SprocketDto } from './dto';

export interface SprocketPersistence {
  getAllPaged: () => Promise<SprocketDto[]>;

  create: (
    dto: CreateOrUpdateSprocketRequestDto
  ) => Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>>;

  findById: (id: string) => Promise<SprocketDto | null>;

  updateById: (id: string, dto: CreateOrUpdateSprocketRequestDto) => Promise<number>;
}
