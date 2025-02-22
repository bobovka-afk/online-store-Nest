import { Body, Controller, Post, BadRequestException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() dto: RegisterDto) {
    const existingUser = await this.userService.findOne(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email уже используется');
    }

    const user = await this.userService.create(dto.email, dto.password);
    return { message: 'Регистрация успешна', userId: user.id };
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() dto: LoginDto) {
    const user = await this.userService.findOne(dto.email);
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
