import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('loc_elements')
export class LocElement {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'text', name: 'name', nullable: false })
  name: string;

  @Column({ type: 'varchar', name: 'iso_alpha_2', nullable: true })
  iso_alpha_2: string;

  @Column({ type: 'bigint', name: 'iso_numeric', nullable: true })
  iso_numeric: number;

  @Column({ type: 'bigint', name: 'parent_id', nullable: true })
  parent_id: number;

  @Column({ type: 'bigint', name: 'element_type_id', nullable: true })
  element_type_id: number;

  @Column({ type: 'bigint', name: 'geoposition_id', nullable: true })
  geoposition_id: number;

  @Column({ type: 'tinyint', name: 'is_site_integration', nullable: true })
  is_site_integration: number;

  @Column({ type: 'tinyint', name: 'is_active', nullable: false })
  is_active: number;

  @Column({ type: 'bigint', name: 'created_by', nullable: true })
  created_by: number;

  @Column({ type: 'timestamp', name: 'active_since', nullable: false })
  active_since: Date;

  @Column({ type: 'bigint', name: 'modified_by', nullable: true })
  modified_by: number;

  @Column({ type: 'text', name: 'modification_justification', nullable: true })
  modification_justification: string;

  @Column({ type: 'bigint', name: 'global_unit_id', nullable: true })
  global_unit_id: number;

  @Column({ type: 'bigint', name: 'rep_ind_regions_id', nullable: true })
  rep_ind_regions_id: number;

  @Column({ type: 'varchar', name: 'iso_alpha_3', nullable: true })
  iso_alpha_3: string;
}
