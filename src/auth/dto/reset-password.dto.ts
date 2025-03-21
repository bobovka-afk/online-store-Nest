import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Токен для сброса пароля',
    type: String,
    example: 'a1b2c3d4e5f67890123456789abcdef',
  })
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty({
    description: 'Новый пароль пользователя',
    type: String,
    minLength: 8,
    maxLength: 64,
    example: 'newSecurePassword123',
  })
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  @IsNotEmpty()
  newPassword: string;
}
