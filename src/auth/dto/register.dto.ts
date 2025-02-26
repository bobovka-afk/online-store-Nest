import { IsString, IsEmail, MinLength, MaxLength, Matches } from 'class-validator'; 

export class RegisterDto  {
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен быть минимум 6 символов' })
  @MaxLength(50, { message: 'Пароль не должен превышать 50 символов' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]+$/, {
    message: 'Пароль должен содержать хотя бы одну букву и одну цифру',
  })
  password: string;
}