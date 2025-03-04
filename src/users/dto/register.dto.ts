import { IsString, IsEmail, MinLength, IsOptional} from 'class-validator';  // unused import

export class RegisterDto  {

  // необходима проверка на то что эти поля обязательные
  // также необходима проверка на длинну строк
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}