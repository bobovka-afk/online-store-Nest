import { IsNumber, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  id?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(1000000)
  price?: number;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  description?: string;
}
