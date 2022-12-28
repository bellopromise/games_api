import { Document } from 'mongoose';
import { IPublisher } from './publisher.interface';

export interface IGame extends Document {
  readonly title: string;
  readonly price: number;
  readonly publisher: IPublisher;
  readonly tags: string[];
  readonly releaseDate: Date;
}
