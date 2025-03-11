import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(1000000)
  price: number;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description?: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  @Max(10000)
  quantity: number;

  @IsArray()
  @ArrayMaxSize(10)
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
