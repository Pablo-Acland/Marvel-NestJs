import {
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
  } from '@nestjs/common';
import { ComicEntity } from 'src/entity/comic.entity';
import { HeroeEntity } from 'src/entity/heroe.entity';
import { Heroe } from 'src/schecmas/heroe.schema';
import { CreateHeroesDto } from '../dto/create.heroe.dto';
  import { HeroeNoSQLService } from '../services/heroe-nosql.service';
  import { HeroeSQLService } from '../services/heroe-sql.service';
  import { MarvelHeroesService } from '../services/marvel-heroes.service';
  
  @Controller('heroe')
  export class HeroeController {
    constructor(
      private readonly marvelHeroeService: MarvelHeroesService,
      private readonly heroeNoSQLService: HeroeNoSQLService,
      private readonly heroeSQLService: HeroeSQLService,
    ) {}
  
    @Get('/nosql/:id')
    getCharacterByIdFromMongo(@Param('id', ParseIntPipe) id: number) {
      return this.heroeNoSQLService.getHeroebyId(id);
    }

    @Get(':offset/:limit')
    async findAll(
      @Param('offset', ParseIntPipe) offset: number,
      @Param('limit', ParseIntPipe) limit: number,
    ) {
      const heroes = await this.marvelHeroeService.getAllHeroes(offset, limit);
      return heroes;
    }
  
    @Post('nosql/:id')
    async saveHeroeNoSQL(@Param('id') id: string) {
      const heroeDto = await this.marvelHeroeService.getHeroeById(id);
      heroeDto.comics= await this.heroeNoSQLService.saveComicIdsByHeroeId(heroeDto.id);

      return this.heroeNoSQLService.save(this.HeroeDteToHeroe(heroeDto));

        
    }
  
    @Post('sql/:id')
    async saveHeroeSQL(@Param('id') id: string) {
       const heroe = await this.marvelHeroeService.getHeroeById(id);
       const heroeEntity= this.HeroeDteToHeroeEntity(heroe);
       const listComicsDto= await this.marvelHeroeService.getComicByHeroeId(heroe.id);

      // transformar heroe en lo que requiero guardar
      this.heroeSQLService.save();
    }
  
    @Put('nosql/:idHeroeExistente/:idNuevoHeroe')
    async updatedHeroeNoSQL(
      @Param('idHeroeExistente') idHeroeExistente: string,
      @Param('idNuevoHeroe') idNuevoHeroe: string,
    ) {

      const heroeExistentDto = await this.marvelHeroeService.getHeroeById(idHeroeExistente);
      const newHeroeDto = await this.marvelHeroeService.getHeroeById(idNuevoHeroe);
      newHeroeDto.comics= await this.heroeNoSQLService.saveComicIdsByHeroeId(newHeroeDto.id);
      const heroeExistent = this.HeroeDteToHeroe(heroeExistentDto);
      const newHeroe = this.HeroeDteToHeroe(newHeroeDto);

      return this.heroeNoSQLService.update(heroeExistent, newHeroe);
    }
  
    @Delete('nosql/delete/:id')
    deleteHeroeNoSQL(@Param('id') id: number) {
      return this.heroeNoSQLService.delete(id);
    }

    HeroeDteToHeroe(heroeDto): Heroe {
      const heroe = new Heroe();
      heroe.heroId = heroeDto.id;
      heroe.name = heroeDto.name;
      heroe.description = heroeDto.description;
      heroe.image = heroeDto.image;
      heroe.comics= heroeDto.comics;
      return heroe;
    }

    HeroeDteToHeroeEntity(heroeDto): HeroeEntity {
      const heroe = new HeroeEntity();
      heroe.heroId= heroeDto.id;
      heroe.name= heroeDto.name;
      heroe.description= heroeDto.description;
      heroe.image= heroeDto.image;
      heroe.comics= heroeDto.comics;
      return heroe;
    }

    ComicDteToComicEntity(comicDto): ComicEntity {
      const comic = new ComicEntity();
      comic.comicId= comicDto.id;
      comic.format= comicDto.format;
      comic.description= comicDto.description;
      comic.title= comicDto.title;
      return comic;
    }

    ListComicDtoToListComicEntity(listComicDto): ComicEntity[]{
      const comicList:ComicEntity[]= [];
      listComicDto.forEach((comic)=>comicList.push(this.ComicDteToComicEntity(comic)))
      return comicList;
    }
  }