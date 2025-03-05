import { Controller, Post, Body, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';

//добавил пайпы
//написать роут для смены (мб восстановления)пароля
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() createUserDto: RegisterDto): Promise<any> {
    const user = await this.authService.register(
      createUserDto.email,
      createUserDto.password,
    );
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto); //убрал логику в сервис
  }

}
