// Libraries
import { Module } from '@nestjs/common';

// Controllers
import { HeroeController } from './controller/heroe.controller';

// Services
import { HeroeSQLService } from './services/heroe-sql.service';
import { HeroeNoSQLService } from './services/heroe-nosql.service';
import { MarvelHeroesService } from './services/marvel-heroes.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';
import { Heroe, HeroeSchema } from 'src/schecmas/heroe.schema';
import { Comic, ComicSchema } from 'src/schecmas/comic.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeroeEntity } from 'src/entity/heroe.entity';
import { ComicEntity } from 'src/entity/comic.entity';

@Module({
  imports: [ConfigModule,
    HttpModule,
    MongooseModule.forFeature([
      { name: Heroe.name, schema: HeroeSchema },
      { name: Comic.name, schema: ComicSchema }, 
    ]),
    TypeOrmModule.forFeature([HeroeEntity, ComicEntity]),],
  controllers: [HeroeController],
  providers: [MarvelHeroesService, HeroeSQLService, HeroeNoSQLService],
})
export class HeroeModule {}