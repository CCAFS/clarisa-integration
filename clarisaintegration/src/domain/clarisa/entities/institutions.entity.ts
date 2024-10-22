import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'institutions' })
export class Institution {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: number;

  @Column({ type: 'text', name: 'name' })
  name: string;

  @Column({ type: 'text', name: 'acronym', nullable: true })
  acronym: string;

  @Column({ type: 'text', name: 'website_link', nullable: true })
  website_link: string;

  @Column({ type: 'bigint', name: 'program_id', nullable: true })
  program_id: number;

  @Column({ type: 'bigint', name: 'institution_type_id' })
  institution_type_id: number;

  @Column({ type: 'timestamp', name: 'added' })
  added: Date;

  @Column({ type: 'bigint', name: 'parent_id', nullable: true })
  parent_id: number;

  @Column({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @Column({ type: 'timestamp', name: 'updated_at', nullable: true })
  updated_at: Date;

  @Column({ type: 'boolean', name: 'is_active' })
  is_active: boolean;

  @Column({ type: 'bigint', name: 'created_by' })
  created_by: number;

  @Column({ type: 'bigint', name: 'updated_by', nullable: true })
  updated_by: number;

  @Column({ type: 'text', name: 'modification_justification', nullable: true })
  modification_justification: string;
}
