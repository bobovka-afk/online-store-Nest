import { IsNumber, IsString, IsDateString } from 'class-validator';

export class OrderResponseDto {
  @IsNumber()
  id: number;

  @IsString()
  status: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  address: string;

  @IsDateString()
  deliveryDate: string;

  @IsNumber()
  totalPrice: number;
}
