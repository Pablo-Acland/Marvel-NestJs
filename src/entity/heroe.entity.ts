import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ComicEntity } from './comic.entity';

@Entity({ name: 'heroe' })
export class HeroeEntity {
  @PrimaryGeneratedColumn()
  heroId: number;
  @Column()
  name: string;
  @Column({ type: 'varchar', length: 255 })
  description: string;
  @Column()
  image: string;

  @ManyToMany((type) => ComicEntity, (comic) => comic.heroes, {
    cascade: true,
  })
  @JoinTable()
  comics: ComicEntity[];
}