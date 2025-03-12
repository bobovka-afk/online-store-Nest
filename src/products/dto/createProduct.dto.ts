import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  Max,
  MinLength,
  MaxLength,
  ArrayMaxSize,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(1000000)
  price: number;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(10000)
  stockQuantity: number;

  @IsArray()
  @ArrayMaxSize(10)
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
