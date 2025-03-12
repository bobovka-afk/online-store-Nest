import {
  IsString,
  IsEmail,
  MinLength,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(64)
  password: string;
}
