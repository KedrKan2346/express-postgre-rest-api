export interface SprocketProductionDto {
  factoryId: string;
  goal: number;
  actual: number;
  collectedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
