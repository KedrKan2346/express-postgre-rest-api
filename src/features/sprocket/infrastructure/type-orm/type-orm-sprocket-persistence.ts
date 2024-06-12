import { Column, PrimaryColumn, Entity } from 'typeorm';
import { TypeOrmBaseEntity } from '@features/shared/infrastructure';

@Entity('sprocket')
export class TypeOrmSprocketPersistence extends TypeOrmBaseEntity {
  @PrimaryColumn({ type: 'uuid', name: 'factory_id', nullable: false })
  factoryId: string;

  @Column({ type: 'smallint', nullable: false })
  teeth: number;

  @Column({ name: 'pitch_diameter', type: 'smallint', nullable: false })
  pitchDiameter: number;

  @Column({ name: 'outside_diameter', type: 'smallint', nullable: false })
  outsideDiameter: number;

  @Column({ type: 'smallint', nullable: false })
  pitch: number;
}
