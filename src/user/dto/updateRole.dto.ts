import { IsEnum, IsNotEmpty, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ERole } from 'auth/enums/roles.enum';

export class UpdateRoleDto {
  @ApiProperty({
    example: 1,
    description: 'ID пользователя',
    type: Number,
  })
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000000)
  id: number;

  @ApiProperty({
    example: ERole.ADMIN,
    description: 'Новая роль пользователя',
    enum: ERole,
  })
  @IsEnum(ERole)
  @IsNotEmpty()
  role: ERole;
}
