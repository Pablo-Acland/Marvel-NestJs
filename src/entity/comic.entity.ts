import { 
  Column, 
  Entity, 
  ManyToMany, 
  PrimaryGeneratedColumn } from 'typeorm';
import { HeroeEntity } from './heroe.entity';


@Entity({ name: 'comic' })
export class ComicEntity {
  @PrimaryGeneratedColumn()
  comicId: number;
  @Column()
  title: string;
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
  @Column()
  format: string;

  @ManyToMany((type) => HeroeEntity, (heroe) => heroe.comics)
  heroes: HeroeEntity[];
}
