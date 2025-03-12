import { IsEnum, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ERole } from 'auth/enums/roles.enum';
export class UpdateRoleDto {
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000000)
  id: number;

  @IsEnum(ERole)
  @IsNotEmpty()
  role: ERole;
}
