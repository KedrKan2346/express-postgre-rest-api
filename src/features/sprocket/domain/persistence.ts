import { CreateOrUpdateSprocketRequestDto, SprocketDto } from './dto';

/**
 * Sprocket persistence abstraction.
 */
export interface SprocketPersistence {
  /**
   * Get paginated sprockets.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprockets limited by "take" parameter.
   */
  getAllPaged: (take: number, skip: number) => Promise<SprocketDto[]>;

  /**
   * Create new sprocket.
   * @param dto Sprocket DTO.
   * @returns Plain object containing id, createdAt, and updatedAt fields.
   */
  create: (
    dto: CreateOrUpdateSprocketRequestDto
  ) => Promise<Pick<SprocketDto, 'id' | 'createdAt' | 'updatedAt'>>;

  /**
   * Get sprocket by id.
   * @param id Sprocket id.
   * @returns Sprocket or null
   */
  findById: (id: string) => Promise<SprocketDto | null>;

  /**
   * Update sprocket by id.
   * @param id Sprocket id.
   * @param dto Sprocket DTO.
   * @returns Number of affected records.
   */
  updateById: (id: string, dto: CreateOrUpdateSprocketRequestDto) => Promise<number>;
}
