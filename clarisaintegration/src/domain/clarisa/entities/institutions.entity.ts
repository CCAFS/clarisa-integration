import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'institutions' })
export class Institution {
  @PrimaryKey({
    autoincrement: true,
    type: 'bigint',
    fieldName: 'id',
  })
  id: number;

  @Property({
    type: 'text',
    fieldName: 'name',
  })
  name: string;

  @Property({
    type: 'text',
    fieldName: 'acronym',
    nullable: true,
  })
  acronym!: string;

  @Property({
    type: 'text',
    fieldName: 'website_link',
    nullable: true,
  })
  website_link!: string;

  @Property({
    type: 'bigint',
    fieldName: 'program_id',
    nullable: true,
  })
  program_id!: number;

  @Property({
    type: 'bigint',
    fieldName: 'institution_type_id',
  })
  institution_type_id: number;

  @Property({
    type: 'timestamp',
    fieldName: 'added',
  })
  added: Date;

  @Property({
    type: 'bigint',
    fieldName: 'parent_id',
    nullable: true,
  })
  parent_id!: number;

  @Property({
    type: 'timestamp',
    fieldName: 'created_at',
  })
  created_at: Date;

  @Property({
    type: 'timestamp',
    fieldName: 'updated_at',
    nullable: true,
  })
  updated_at!: Date;

  @Property({
    type: 'boolean',
    fieldName: 'is_active',
  })
  is_active: boolean;

  @Property({
    type: 'bigint',
    fieldName: 'created_by',
  })
  created_by: number;

  @Property({
    type: 'bigint',
    fieldName: 'updated_by',
    nullable: true,
  })
  updated_by!: number;

  @Property({
    type: 'text',
    fieldName: 'modification_justification',
    nullable: true,
  })
  modification_justification!: string;
}
