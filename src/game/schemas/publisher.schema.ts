import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublisherDocument = Publisher & Document;

@Schema()
export class Publisher {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  siret: number;

  @Prop({ required: true })
  phone: string;
}

export const PublisherSchema = SchemaFactory.createForClass(Publisher);
