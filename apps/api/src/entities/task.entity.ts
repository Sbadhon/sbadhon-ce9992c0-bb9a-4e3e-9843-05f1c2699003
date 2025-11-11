import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import {
  TaskStatus,
  TaskCategory,
} from '@turbovets-workspace/data';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  orgId!: string;

  @Index()
  @Column({ type: 'uuid' })
  createdByUserId!: string;

  @Column({ length: 160 })
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string | null;

  @Index()
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.TODO })
  status!: TaskStatus;

  @Index()
  @Column({ type: 'enum', enum: TaskCategory, nullable: true })
  category?: TaskCategory | null;

  @Column({ type: 'int', default: 0 })
  order!: number;

  @Column({ type: 'timestamptz', nullable: true })
  dueDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
