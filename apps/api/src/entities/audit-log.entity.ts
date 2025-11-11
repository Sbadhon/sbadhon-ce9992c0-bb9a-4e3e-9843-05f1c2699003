import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  orgId: string;

  @Index()
  @Column()
  userId: string;

  @Index()
  @Column({ type: 'text' })
  action: string;

  @Index()
  @Column({ type: 'text' })
  resource: 'task';

  @Index()
  @Column()
  resourceId: string;

  @Column({ type: 'jsonb', nullable: true })
  meta?: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt: Date;
}
