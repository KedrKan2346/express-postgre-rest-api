import { SprocketProductionDto } from './dto';

/**
 * Sprocket production persistence abstraction.
 */
export interface SprocketProductionPersistence {
  /**
   * Get paginated sprocket production data.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns All sprocket production data limited by "take" parameter.
   */
  getAllPaged: (take: number, skip: number) => Promise<SprocketProductionDto[]>;

  /**
   * Get paginated sprocket production data filtered by factory id.
   * @param factoryId Factory id.
   * @param take Number of records to return (for paging).
   * @param skip Number of records to skip (for paging).
   * @returns Factory sprocket production data limited by "take" parameter.
   */
  getAllPagedByFactoryId: (factoryId: string, take: number, skip: number) => Promise<SprocketProductionDto[]>;
}
