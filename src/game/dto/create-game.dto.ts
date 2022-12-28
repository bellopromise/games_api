import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsArray,
  IsString,
  IsNumber,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

import { CreatePublisherDto } from './create-publisher-dto';

export class CreateGameDto {
  @ApiProperty({
    type: String, 
    example: 'FIFA 23',
    description: 'Game title',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: '100',
  description: 'The price of game. State 0 when free',
  required: true, 
  type: Number})
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({required: true, type: CreatePublisherDto})
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreatePublisherDto)
  publisher: CreatePublisherDto;

  @ApiProperty({example: ['sports', 'adventure'],
  description: 'List of the tags for the game', 
  required: true,
  type: [String]})
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  tags: string[];

  @ApiProperty({example: '2021-07-11',
  description: 'RelDate in  string',
  required: true,
  type: Date})
  @IsDateString()
  @IsNotEmpty()
   releaseDate: Date;
}
