import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types, Schema as MongooseSchema } from 'mongoose';
import { Publisher, PublisherSchema } from './publisher.schema';
import {Type } from 'class-transformer';
import { IPublisher } from '../interfaces/publisher.interface';

@Schema()
export class Game extends Document{

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type:PublisherSchema})
  @Type(()=> Publisher)
  publisher: IPublisher;

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  releaseDate: Date;
}

export const GameSchema = SchemaFactory.createForClass(Game);
