import { Body, Controller, Post, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    const existingUser = await this.authService.findOne(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email уже используется');
    }

    const user = await this.authService.create(dto.email, dto.password);
    return { message: 'Регистрация успешна', userId: user.id };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.findOne(dto.email);
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Неверный пароль');
    }

    return { message: 'Авторизация успешна', userId: user.id };
  }
}
