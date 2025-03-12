import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class RemoveFromCartDto {
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  productId: number;
}
