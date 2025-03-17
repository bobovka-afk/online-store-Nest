import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, IsOptional, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    example: 20,
    description: 'Ограничение количества элементов на странице',
    required: false,
    minimum: 1,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
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
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiProperty({
    example: 'desc',
    description:
      'Сортировка по цене (asc - по возрастанию, desc - по убыванию)',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  priceOrder?: 'asc' | 'desc' = 'desc';
}
