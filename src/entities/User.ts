import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  Relation,
} from 'typeorm';
import { Profile } from './Profile.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @Column({ nullable: false })
  name!: string;

  @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
  profile!: Relation<Profile>; 

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
