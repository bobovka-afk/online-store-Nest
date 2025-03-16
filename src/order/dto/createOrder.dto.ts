import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  MinLength,
  MaxLength,
  IsDateString,
} from 'class-validator';

export class CreateOrderDto {
  @IsPhoneNumber('RU')
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @IsDateString()
  deliveryDate: string;
}
