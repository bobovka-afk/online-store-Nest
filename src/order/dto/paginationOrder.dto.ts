import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationOrderDto {
  @ApiProperty({
    example: 20,
    description: 'Ограничение количества элементов на странице',
    required: false,
    minimum: 1,
    default: 20,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 20))
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiProperty({
    example: 0,
    description: 'Смещение для пагинации',
    required: false,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : 0))
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    example: 'generated',
    description: 'Фильтрация по статусу заказа',
    required: false,
    enum: ['generated', 'completed', 'cancelled'],
  })
  @IsOptional()
  @IsIn(['generated', 'completed', 'cancelled'])
  status?: 'generated' | 'completed' | 'cancelled';
}
