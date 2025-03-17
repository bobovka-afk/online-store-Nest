import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive, Max } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    example: 1,
    description: 'ID товара, который нужно добавить в корзину',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'Количество товара для добавления в корзину',
    maximum: 1000000,
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(1000000)
  quantity: number;
}
