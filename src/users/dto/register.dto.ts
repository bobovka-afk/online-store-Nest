import { IsString, IsEmail, MinLength, IsOptional} from 'class-validator'; 

export class RegisterDto  {
  @IsEmail({}, { message: 'Неверный формат email' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}