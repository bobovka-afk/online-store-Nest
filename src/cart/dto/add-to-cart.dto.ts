import { IsNotEmpty, IsNumber, IsPositive, Max } from 'class-validator';

export class AddToCartDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  productId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Max(1000000)
  quantity: number;
}
