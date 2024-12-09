import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('News')
export class News {
  @PrimaryGeneratedColumn()
  newsId!: number;

  @Column()
  title!: string;

  @Column()
  description!: string;

  @Column()
  source!: string;

  @Column({ unique: true, nullable: false })
  url!: string;

  @Column()
  publishedAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
