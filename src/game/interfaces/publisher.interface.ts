import { Document } from 'mongoose';

export interface IPublisher extends Document {
  readonly name: string;
  readonly siret: number;
  readonly phone: string;
}
