import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsNotEmpty, IsPositive } from 'class-validator';

export class RemoveFromCartDto {
  @ApiProperty({
    example: 1,
    description: 'ID товара, который нужно удалить из корзины',
  })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  productId: number;
}
