import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  ManyToOne,
} from 'typeorm';
import { User } from './User.js';

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  newsId!: number;
  @Column()
  title!: string;
  @Column()
  description!: string;
  @Column()
  url!: string;
  @Column()
  publishedAt!: Date;
  @CreateDateColumn()
  createdAt!: Date;
  @UpdateDateColumn()
  updatedAt!: Date;
}

@Entity('Bookmark')
export class Bookmark {
  @PrimaryGeneratedColumn()
  bookmarkId!: number;
  @ManyToOne(() => User)
  user!: User;
  @ManyToOne(() => News)
  news!: News;
}
