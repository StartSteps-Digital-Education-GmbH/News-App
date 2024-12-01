import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { User } from './User.js';

@Entity('profiles') 
export class Profile {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  bio!: string;

  @Column({ nullable: true })
  avatarUrl!: string;

  @OneToOne(() => User, (user) => user.profile)
  @JoinColumn()
  user!: Relation<User>; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
