import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
   id: string;

  @Column({ unique: true }) 
  email: string;

  @Column() 
  passwordHash: string;

  @Column() 
  orgId: string;

  @Column({ type: 'text' }) 
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn() 
  updatedAt: Date;
}
