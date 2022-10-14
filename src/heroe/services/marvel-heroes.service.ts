import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHash } from 'crypto';
import { lastValueFrom, map } from 'rxjs';
import { Comic } from 'src/schecmas/comic.schema';
import { Heroe } from 'src/schecmas/heroe.schema';
import { CreateComicDto } from '../dto/create.comic.dto';
import { CreateHeroesDto } from '../dto/create.heroe.dto';

@Injectable()
export class MarvelHeroesService {

  private;
  constructor(
    private readonly config: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  
  getAllHeroes(offset: number, limit: number): any {
    const privateKey = '0a21bbaa5db2069fd09b1d73a39f4b2895ecb2ce';
    const ts = '3000';
    const publicKey = '1dddef679a99b48ed36ea4e2aa850674';
    const hash = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
      console.log(this.config.get<string>('PRIVATE_KEY'))
    const uri = `https://gateway.marvel.com/v1/public/characters?apikey=${publicKey}&ts=${ts}&hash=${hash}&limit=${limit}&offset=${offset}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map((res) => {
          const dtoList = [];
          res.data.data.results.forEach((heroe2) => {
            const heroeDto = new CreateHeroesDto();
            heroeDto.id = heroe2.id;
            heroeDto.name = heroe2.name;
            heroeDto.description = heroe2.description;
            heroeDto.image = `${heroe2.thumbnail.path}.${heroe2.thumbnail.extension}`;
            dtoList.push(heroeDto);
          });
          return dtoList;
        }),
      ),
    );
  }


  getHeroeById(id: string): Promise<CreateHeroesDto> {
    const privateKey = '0a21bbaa5db2069fd09b1d73a39f4b2895ecb2ce';
    const ts = '3000';
    const publicKey = '1dddef679a99b48ed36ea4e2aa850674';
    const hash = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com/v1/public/characters/${id}?apikey=${publicKey}&ts=${ts}&hash=${hash}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map((res) => {
          const heroe2 = res.data.data.results[0];
            const heroeDto = new CreateHeroesDto();
            heroeDto.id = heroe2.id;
            heroeDto.name = heroe2.name;
            heroeDto.description = heroe2.description;
            heroeDto.image = `${heroe2.thumbnail.path}.${heroe2.thumbnail.extension}`;
          return heroeDto;
        }),
      ),
    );
  }

  getComicByHeroeId(heroeId: number): Promise<CreateComicDto[]> {
    const privateKey = '0a21bbaa5db2069fd09b1d73a39f4b2895ecb2ce';
    const ts = '3000';
    const publicKey = '1dddef679a99b48ed36ea4e2aa850674';
    const hash = createHash('md5')
      .update(ts + privateKey + publicKey)
      .digest('hex');
    const uri = `https://gateway.marvel.com/v1/public/characters/${heroeId}/comics?apikey=${publicKey}&ts=${ts}&hash=${hash}`;

    return lastValueFrom(
      this.httpService.get(uri).pipe(
        map((res) => {
          return res.data.data.results.map((comic) => {
            const comicDto = new CreateComicDto();
            comicDto.id = comic.id;
            comicDto.title = comic.title;
            comicDto.description = comic.description;
            comicDto.format = comic.format;
            return comicDto;
          });
        }),
      ),
    );
  }
  
}
