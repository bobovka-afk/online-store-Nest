import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, IsDateString, IsPhoneNumber } from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Email клиента',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Номер телефона клиента (формат для России)',
  })
  @IsPhoneNumber('RU')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    example: 'г. Москва, ул. Ленина, д. 5, кв. 10',
    description: 'Адрес доставки',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  address: string;

  @ApiProperty({
    example: '2025-03-17T12:00:00Z',
    description: 'Дата доставки в формате ISO 8601',
  })
  @IsDateString()
  deliveryDate: string;
}
