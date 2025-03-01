import { Controller, Post, Body, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto'
import { RegisterDto } from '../users/dto/register.dto'
import { UpdateRoleDto } from 'users/dto/updateRole.dto';
import { BadRequestException } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto.email, registerDto.password);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(await this.authService.validateUser(loginDto.email, loginDto.password));
  }


  @Patch('update-role')
  async updateUserRole(@Body() { email, id, role }: UpdateRoleDto) {
    if (!email && !id) {
      throw new BadRequestException('Email или ID должны быть предоставлены');
    }

    if (email) {
      return this.authService.updateRole(email, role);
    } else if (id) {
      return this.authService.updateRole(id, role);
    } else {
      throw new BadRequestException('Некорректные данные');
    }
  }
}