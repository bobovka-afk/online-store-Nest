import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  description?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
