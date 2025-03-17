import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDateString } from 'class-validator';

export class OrderResponseDto {
  @ApiProperty({
    example: 1,
    description: 'ID заказа',
    type: Number,
  })
  @IsNumber()
  id: number;

  @ApiProperty({
    example: 'Pending',
    description: 'Статус заказа',
  })
  @IsString()
  status: string;

  @ApiProperty({
    example: '+79001234567',
    description: 'Номер телефона клиента',
  })
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    example: 'г. Москва, ул. Ленина, д. 5, кв. 10',
    description: 'Адрес доставки',
  })
  @IsString()
  address: string;

  @ApiProperty({
    example: '2025-03-17T12:00:00Z',
    description: 'Дата доставки в формате ISO 8601',
  })
  @IsDateString()
  deliveryDate: string;

  @ApiProperty({
    example: 1999.99,
    description: 'Общая цена заказа',
    type: Number,
  })
  @IsNumber()
  totalPrice: number;
}
