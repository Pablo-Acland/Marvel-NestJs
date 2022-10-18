import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Connection, Model, ObjectId } from 'mongoose';
import { lastValueFrom, map } from 'rxjs';
import { Comic, ComicDocument } from 'src/schecmas/comic.schema';
import { Heroe, HeroeDocument } from 'src/schecmas/heroe.schema';
import { CreateComicDto } from '../dto/create.comic.dto';

@Injectable()
export class HeroeNoSQLService {

  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Heroe.name)
    private heroeModel: Model<HeroeDocument>,
    private readonly httpService: HttpService,
    @InjectModel(Comic.name)
    private readonly comicModel: Model<ComicDocument>,
  ) {}
  
  getHeroebyId(id: number): any {
    const heroe = this.heroeModel.findOne({ heroId: id }).populate('comics');
    if (!heroe) {
      throw new BadRequestException('El heroe no existe');
    }
    return heroe;
  }

  getAllCharacters() {
    return this.heroeModel.find().exec();
  }

  async save(heroe: Heroe): Promise<Heroe> {
    const heroe2 = await this.heroeModel.findOne({ heroId: heroe.heroId });

    if (heroe2) {
      throw new BadRequestException('El Heroe ya existe');
    }

    const newHeroe = new this.heroeModel(heroe);
    return newHeroe.save();
  }

  async update(heroeExistente: Heroe, nuevoHero: Heroe): Promise<Heroe> {
    const heroe =  await this.heroeModel.findOne({ heroId: nuevoHero.heroId });
    const heroe2 =  await this.heroeModel.findOne({ heroId: heroeExistente.heroId });

    if (heroe) {
      throw new BadRequestException('El Heroe ya existe');
    }

    heroe2.heroId= nuevoHero.heroId;
    heroe2.name= nuevoHero.name;
    heroe2.description= nuevoHero.description;
    heroe2.image= nuevoHero.image;
    heroe2.comics= nuevoHero.comics;
    return heroe2.save();
  }

  async delete(HeroId: number) {
    const heroe =  await this.heroeModel.findOne({ heroId: HeroId });
    if (!heroe) {
      throw new BadRequestException('El heroe no existe');
    }
    return heroe.delete();
  }

  async saveComicIdsByHeroeId(heroeId: number): Promise<ObjectId[]> {
    const privateKey = '0a21bbaa5db2069fd09b1d73a39f4b2895ecb2ce';
    const ts = '3000';
    const publicKey = '1dddef679a99b48ed36ea4e2aa850674';

    const hash = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com/v1/public/characters/${heroeId}/comics?apikey=${publicKey}&ts=${ts}&hash=${hash}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map(async (res) => {
          const t = res.data.data.results.map(async (comic) => {
            const newComicDto = this.ComicToComicDto(comic);

            const comic2 = await this.comicModel.findOne({comicId: newComicDto.id,});
            if (comic2) {
              return comic2;
            }

            const newComic = await this.comicModel.create(newComicDto);
            return newComic.save();
          });

          const t2 = await Promise.all(t);
          return t2.map((comic) => {
            return comic._id;
          });
        }),
      ),
    );
  }

  ComicToComicDto(comic): CreateComicDto {
    const comicDto = new CreateComicDto();
    comicDto.id = comic.id;
    comicDto.description = comic.description;
    comicDto.title = comic.title;
    comicDto.format = comic.format;

    return comicDto;
  }
}
