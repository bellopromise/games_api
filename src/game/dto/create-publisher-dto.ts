import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
} from 'class-validator';
export class CreatePublisherDto {
  @ApiProperty({
    required: true, 
    example: 'The name of publisher', 
    description: 'Publisher name', 
    type: String
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    required: true,
    example: 5347898,
    description: 'The SIRET code',
    type: Number
  })
  @IsNumber()
  @IsNotEmpty()
  siret: number;

  @ApiProperty({
    required: true,
    example: '2348143272804',
    description: 'Phone number',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}
