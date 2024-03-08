import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'institutions_locations' })
export class InstitutionsLocations {
  @PrimaryKey({
    autoincrement: true,
    type: 'bigint',
    fieldName: 'id',
  })
  id: number;

  @Property({
    type: 'bigint',
    fieldName: 'institution_id',
  })
  institution_id: number;

  @Property({
    type: 'bigint',
    fieldName: 'loc_element_id',
  })
  loc_element_id: number;

  @Property({
    type: 'tinyint',
    fieldName: 'is_headquater',
  })
  is_headquater: number;

  @Property({
    type: 'text',
    fieldName: 'city',
    nullable: true,
  })
  city!: string;
}
