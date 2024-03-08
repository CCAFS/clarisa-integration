import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'loc_elements' })
export class LocElement {
  @PrimaryKey({
    fieldName: 'id',
    type: 'bigint',
    autoincrement: true,
  })
  id: number;

  @Property({
    type: 'text',
    fieldName: 'name',
    nullable: false,
  })
  name: string;

  @Property({
    type: 'varchar',
    fieldName: 'iso_alpha_2',
    nullable: true,
  })
  iso_alpha_2: string;

  @Property({
    type: 'bigint',
    fieldName: 'iso_numeric',
    nullable: true,
  })
  iso_numeric: number;

  @Property({
    type: 'bigint',
    fieldName: 'parent_id',
    nullable: true,
  })
  parent_id: number;

  @Property({
    type: 'bigint',
    fieldName: 'element_type_id',
    nullable: true,
  })
  element_type_id: number;

  @Property({
    type: 'bigint',
    fieldName: 'geoposition_id',
    nullable: true,
  })
  geoposition_id: number;

  @Property({
    type: 'tinyint',
    fieldName: 'is_site_integration',
    nullable: true,
  })
  is_site_integration: number;

  @Property({
    type: 'tinyint',
    fieldName: 'is_active',
    nullable: false,
  })
  is_active: number;

  @Property({
    type: 'bigint',
    fieldName: 'created_by',
    nullable: true,
  })
  created_by: number;

  @Property({
    type: 'timestamp',
    fieldName: 'active_since',
    nullable: false,
  })
  active_since: Date;

  @Property({
    type: 'bigint',
    fieldName: 'modified_by',
    nullable: true,
  })
  modified_by: number;

  @Property({
    type: 'text',
    fieldName: 'modification_justification',
    nullable: true,
  })
  modification_justification: string;

  @Property({
    type: 'bigint',
    fieldName: 'global_unit_id',
    nullable: true,
  })
  global_unit_id: number;

  @Property({
    type: 'bigint',
    fieldName: 'rep_ind_regions_id',
    nullable: true,
  })
  rep_ind_regions_id: number;

  @Property({
    type: 'varchar',
    fieldName: 'iso_alpha_3',
    nullable: true,
  })
  iso_alpha_3: string;
}
