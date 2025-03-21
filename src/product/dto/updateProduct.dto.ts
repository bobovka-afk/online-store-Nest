import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 1,
    description: 'ID товара',
    required: false,
    minimum: 1,
    maximum: 1000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  id?: number;

  @ApiProperty({
    example: 899.99,
    description: 'Цена товара',
    required: false,
    type: Number,
    maximum: 1000000,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(1000000)
  price?: number;

  @ApiProperty({
    example: 'Обновленное описание товара',
    description: 'Описание товара',
    required: false,
    minLength: 3,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description?: string;

  @ApiProperty({
    example: 50,
    description: 'Количество товара на складе',
    required: false,
    minimum: 0,
    maximum: 10000,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(10000)
  stockQuantity?: number;
}
