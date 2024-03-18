import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('institutions_locations')
export class InstitutionsLocations {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    type: 'bigint',
    name: 'institution_id',
  })
  institution_id: number;

  @Column({
    type: 'bigint',
    name: 'loc_element_id',
  })
  loc_element_id: number;

  @Column({
    type: 'tinyint',
    name: 'is_headquater',
  })
  is_headquater: number;

  @Column({
    type: 'text',
    name: 'city',
    nullable: true,
  })
  city!: string;
}
