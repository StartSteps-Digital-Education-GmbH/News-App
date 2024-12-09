import {
  PrimaryGeneratedColumn,
  Entity,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './User.js';
import { News } from './News.js';

@Entity('Bookmark')
export class Bookmark {
  @PrimaryGeneratedColumn()
  bookmarkId!: number;

  @ManyToOne(() => User)
  user!: User;

  @ManyToOne(() => News)
  news!: News;

  @CreateDateColumn()
  createdAt!: Date;
}
