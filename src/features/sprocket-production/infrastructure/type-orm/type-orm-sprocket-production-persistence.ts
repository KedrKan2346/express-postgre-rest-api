import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity('sprocket_production_snapshot')
export class TypeOrmSprocketProductionPersistence {
  @ViewColumn({ name: 'factory_id' })
  factoryId: string;

  @ViewColumn()
  actual: number;

  @ViewColumn()
  goal: number;

  @ViewColumn({ name: 'collected_at' })
  collectedAt: Date;

  @ViewColumn({ name: 'created_at' })
  createdAt: Date;

  @ViewColumn({ name: 'updated_at' })
  updatedAt: Date;
}
