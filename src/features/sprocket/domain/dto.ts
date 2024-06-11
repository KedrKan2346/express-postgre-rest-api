export interface CreateOrUpdateSprocketRequestDto {
  factoryId: string;
  teeth: number;
  pitchDiameter: number;
  outsideDiameter: number;
  pitch: number;
}

export interface SprocketDto {
  id?: string;
  factoryId: string;
  teeth: number;
  pitchDiameter: number;
  outsideDiameter: number;
  pitch: number;
  createdAt?: Date;
  updatedAt?: Date;
}
