import { IsString, IsEmail, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Неверный email' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
