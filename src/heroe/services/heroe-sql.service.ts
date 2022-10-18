import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HeroeEntity } from 'src/entity/heroe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class HeroeSQLService {
  constructor(
    @InjectRepository(HeroeEntity)
    private heroeRepository: Repository<HeroeEntity>,
  ) {}

  async getHeroes() {
    const heroes = await this.heroeRepository.find();
    if (!heroes.length) {
      throw new BadRequestException('El heroe no existe');
    }
    return heroes;
  }

  save(heroe: HeroeEntity) {
    return this.heroeRepository.manager.save(heroe);
  }

  /*update() {
    throw new Error('No está implementado');
  }*/

  async delete(heroeId: number) {
    const heroe = await this.heroeRepository.findOne({where: {heroId: heroeId}})
    if(!heroe){
      throw new BadRequestException('El heroe no existe');
    }
     return this.heroeRepository.delete(heroe);
  }
}
