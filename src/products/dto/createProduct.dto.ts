import { IsString, IsNumber, IsArray } from 'class-validator';

export class CreateProductDto {
  // если какие-то поля обязательные, проставляем @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  price: number; // валидируем формат и диапазон числа (чтоб нельзя было ввести -39174, 0, 0001, 1.92384729385729835729835723985723498579348537598347 и тд

  @IsString()
  description?: string;

  @IsArray()
  @IsNumber({}, { each: true }) // уверен что оно так работает?
  categoryIds: number[];
}
