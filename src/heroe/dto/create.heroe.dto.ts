import { ObjectId } from "mongoose";

export class CreateHeroesDto {
  id: number;
  name: string;
  description: string;
  image: string;
  comics: ObjectId[];
}
