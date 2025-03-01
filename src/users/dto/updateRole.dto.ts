import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsInt, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';
import { Role } from 'auth/enums/roles.enum';

export class UpdateRoleDto {
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
