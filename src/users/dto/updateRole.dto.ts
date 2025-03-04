import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsInt, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'auth/enums/roles.enum';

export class UpdateRoleDto {
  /*
   чистая чепуха --
   1 - ты делаешь поле опциональным, но в то же время у тебя идет проверка что он не undefined.
   2 - Если поле обязательное, то проверка которая в первом декораторе тоже чистая чепуха, можно просто прописать @IsNotEmpty()
   3 - Что будет не передадут ни эмейл ни айди, если поля опциональные?
   4 - Что будет если передадут оба поля одновременно?
   5 - Достаточно работать только с одним полем, или с айди или с эмейлом (лучше с айди, либо получать эмейл и потом в функции по нему сразу вытаскивать айди), оба не надо
   */
  @ValidateIf((o) => o.email !== undefined)
  @IsEmail({}, { message: 'Некорректный email' })
  @IsOptional() 
  email?: string;

  @ValidateIf((o) => o.id !== undefined) 
  @IsInt({ message: 'ID должен быть числом' })
  @Type(() => Number) 
  @IsOptional() 
  id?: number;

  @IsEnum(Role, { message: 'Роль должна быть "user" или "admin"' })
  @IsNotEmpty()
  role: Role;
}
