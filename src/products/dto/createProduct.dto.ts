import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    example: 'iPhone 15',
    description: 'Название товара',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 999.99,
    description: 'Цена товара',
    type: Number,
    maximum: 1000000,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(1000000)
  price: number;

  @ApiProperty({
    example: 'Флагманский смартфон от Apple',
    description: 'Описание товара',
    minLength: 3,
    maxLength: 100,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    example: 100,
    description: 'Количество товара на складе',
    type: Number,
    maximum: 10000,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(10000)
  stockQuantity: number;

  @ApiProperty({
    example: [1, 2, 3],
    description: 'Список ID категорий',
    type: [Number],
    maxItems: 10,
  })
  @IsArray()
  @ArrayMaxSize(10)
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  categoryIds: number[];
}
