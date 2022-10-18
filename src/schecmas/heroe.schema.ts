import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type HeroeDocument = Heroe & Document;

@Schema({ versionKey: false })
export class Heroe{
  
  @Prop()
  heroId: number;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  image: string;

  @Prop()
  comics: ObjectId[];
}

export const HeroeSchema = SchemaFactory.createForClass(Heroe);
